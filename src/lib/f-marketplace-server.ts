import $ = require('jquery');

import marketplace from './f-marketplace-base';
import Merchant from './f-marketplace-merchant';
import BudgetModel from './f-marketplace-budget-model';
import CampaignModel from './f-marketplace-campaign-model';



class Server {

  constructor(private _element: ServerElement) {}

  createdCallback() {
    if (!this._element) {
      Server.call(this, this);
    }
  }

  getMerchant(merchantId: number): Promise<Merchant> {
    var promise = new Promise<Merchant>(
        (resolve, reject) => {
        resolve(Merchant.fromJson(
          JSON.parse('{\
            "id": 234,\
            "name": "Walmart Canada",\
            "flipp_premium": true,\
            "flyers_premium": true,\
            "currency": "CAD",\
            "billing_location": 5,\
            "freshbooks_client_id": 44475,\
            "created_at": "2011-05-09T06:06:11.000Z",\
            "updated_at": "2016-08-16T22:44:29.000Z",\
            "us_based": false,\
            "salesforce_flipp_optimization": 100,\
            "breakdown_invoice": true,\
            "large_image_path": "merchants/234/1399558052/large",\
            "deleted": false,\
            "salesforce_segment": "Large Regional",\
            "salesforce_industry": "General Merch",\
            "salesforce_ops_lead_id": "00580000002rexW",\
            "salesforce_account_manager_id": "005C0000009dXne",\
            "salesforce_owner_id": "00580000001pxSe",\
            "salesforce_name": "Walmart Canada",\
            "mp_ported": true\
          }')
        ))
      // $.ajax({
      //     url: this.src + '/api/merchants/' + merchantId,
      //     method: 'GET',
      //     data: {},
      //     complete: function(response) {
      //       var json = response.responseJSON;
      //       resolve(Merchant.fromJson(json['merchant']))
      //     },
      //     error: function(error) {
      //       reject(error)
      //     }
      // });
    });

    return promise;
  }

  getCampaign(campaignId: number): Promise<CampaignModel> {
    var promise = new Promise<CampaignModel>(
        (resolve, reject) => {
      $.ajax({
          url: this.src + '/api/campaigns/' + campaignId,
          method: 'GET',
          data: {},
          complete: function(response) {
            var json = response.responseJSON;
            resolve(CampaignModel.fromJson(json['campaign']))
          },
          error: function(error) {
            reject(error)
          }
      });
    });

    return promise;
  }

  getBudget(budgetId: number): Promise<BudgetModel> {
    var promise = new Promise<BudgetModel>(
        (resolve, reject) => {
      $.ajax({
          url: this.src + '/api/budgets/' + budgetId,
          method: 'GET',
          data: {},
          complete: function(response) {
            var json = response.responseJSON;
            resolve(BudgetModel.fromJson(json['budget']))
          },
          error: function(error) {
            reject(error)
          }
      });
    });

    return promise;
  }

  get(url: string): Promise<any> {
    var promise = new Promise<any>(
      (resolve, reject) => {
        $.ajax({
          url: this.src + '/api/' + url,
          method: 'GET',
          data: {},
          complete: function(response) {
            var json = response.responseJSON;
            resolve(json);
          },
          error: function(error) {
            reject(error);
          }
        });
      }
    );
    return promise
  }

  post(url: string, body: any): Promise<any> {
    var promise = new Promise<any>(
      (resolve, reject) => {
        $.ajax({
          url: this.src + '/api/' + url,
          method: 'POST',
          data: {body: body},
          complete: function(response) {
            var json = response.responseJSON;
            resolve(json);
          },
          error: function(error) {
            reject(error);
          }
        });
      }
    );
    return promise
  }

  get src(): string {
    var src = this._element.getAttribute('src');
    return (src) ? src : "";
  }

  set src(value: string) {
    this._element.setAttribute('src', value);
  }

}


var ServerElement =
  marketplace.registerElement('f-marketplace-server', HTMLElement, Server);

interface ServerElement extends HTMLElement {
  src: string;
  getMerchant(merchantId: number): Promise<Merchant>;
  getCampaign(campaignId: number): Promise<CampaignModel>;
  getBudget(budgetId: number): Promise<BudgetModel>;
  get(url: string): Promise<any>;
  post(url: string, body: any): Promise<any>;
}

export default ServerElement;