import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

// import Mia Table Service
import { ClientService } from 'src/app/services/client.service';

// import AgencyCoda dependencies
import { MiaConfirmModalComponent, MiaConfirmModalConfig, MiaPagination, MiaQuery } from '@agencycoda/mia-core';
import { MiaTableComponent, MiaTableConfig } from '@agencycoda/mia-table';
import { MatDialog } from '@angular/material/dialog';
import { MiaField, MiaFormConfig, MiaFormModalV2Component, MiaFormModalV2Config } from '@agencycoda/mia-form';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  @ViewChild('tableComp') tableComp!: MiaTableComponent;

  tableConfig: MiaTableConfig = new MiaTableConfig();
  mockData?: MiaPagination<any>;

  queryScroll = new MiaQuery();

  constructor(
    public clientService: ClientService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadConfig();
    this.queryScroll.itemPerPage = 1;
  }

  /**
   * Set Initial Config of Mia-Table
   */
  loadConfig() {
    // Integrate Modal with Service
    this.tableConfig.service = this.clientService;
    this.tableConfig.id = "table-test";
    this.tableConfig.columns = [
      { key: 'firstname', type: 'string', title: 'name', field_key: 'firstname' },
      { key: 'lastname', type: 'string', title: 'surname', field_key: 'lastname' },
      { key: 'email', type: 'string', title: 'email', field_key: 'email' },
      {
        key: 'more',
        type: 'more',
        title: '',
        extra: {
          actions: [
            { icon: 'create', title: 'Edit', key: 'edit' },
            { icon: 'delete', title: 'Erase', key: 'remove' },
          ]
        }
      }
    ];

    this.tableConfig.loadingColor = 'red';
    this.tableConfig.hasEmptyScreen = true;
    this.tableConfig.emptyScreenTitle = 'No clients exist';

    // Handle Table Actions
    this.tableConfig.onClick.subscribe(action => {
      this.handleActions(action);
    })

    this.mockData = {
      current_page: 1,
      first_page_url: '',
      from: '',
      last_page: 1,
      last_page_url: '',
      next_page_url: '',
      path: '',
      per_page: 5,
      prev_page_url: '',
      to: '',
      total: 1,
      data: []
    }
  }

  /**
   * Handle Actions
   * @param action Action that will be performed
   */
  handleActions(action: any) {
    switch (action.key) {
      case 'edit':
        this.showFormModal(action.item);
        break;
      case 'remove':
        this.showConfirmModal(action.item.id);
        break;
    }
  }

  /**
   * Show Modal depending on action.
   * @param action Action will be performed (edit, erase)
   */
  showFormModal(item: any, type: string = 'edit') {
    let data = new MiaFormModalV2Config();
    data.item = item;
    data.service = this.clientService;
    if (type === 'edit') data.title = 'Edit Client';
    else data.title = 'Add Client'
    data.service = this.clientService;

    let config = new MiaFormConfig();
    config.hasSubmit = false;
    config.fields = [
      { key: 'firstname', type: MiaField.TYPE_STRING, label: 'name', validators: [Validators.required] },
      { key: 'lastname', type: MiaField.TYPE_STRING, label: 'surname', validators: [Validators.required] },
      { key: 'email', type: MiaField.TYPE_STRING, label: 'email', validators: [Validators.required] }
    ];
    data.config = config;
    return this.dialog.open(MiaFormModalV2Component, {
      width: '520px',
      panelClass: 'modal-full-width-mobile',
      data: data
    }).afterClosed();
  }

  /**
   * Show Erase Confirmation Modal
   * @param id Id of the client that will be deleted depending on the confirm
   */
  showConfirmModal(id: number) {
    let data = new MiaConfirmModalConfig();
    data.title = 'ARE YOU SURE?'

    let config = new MiaFormConfig();
    config.hasSubmit = true;
    var dialogRef = this.dialog.open(MiaConfirmModalComponent,
      {
        width: '300px',
        data: data
      });

    dialogRef.afterClosed()
      .pipe(first())
      .subscribe(confirmed => {
        if (!confirmed) return;

        this.clientService
          .removeOb(id)
          .subscribe(() => this.reloadMockData())
      })
  }

  /**
   * Show Add Client Modal
   */
  addClient() {
    this.showFormModal({}, 'create')
      .subscribe((saved) => saved && this.reloadMockData());
  }

  /**
   * Reload Mockdata
   */
  reloadMockData() {
    this.clientService.list(this.queryScroll);
    this.tableComp.loadItems();
  }
}
