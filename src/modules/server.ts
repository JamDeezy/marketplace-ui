require('jquery');

import Budget from 'models/budget';
import Campaign from 'models/campaign';
import Merchant from 'models/merchant';


module Server {
  export function getMerchant(merchantId: number): Promise<Merchant> {
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

  export function getCampaign(campaignId: number): Promise<Campaign> {
    var promise = new Promise<Campaign>(
        (resolve, reject) => {
      $.ajax({
          url: this.src + '/api/campaigns/' + campaignId,
          method: 'GET',
          data: {},
          complete: function(response) {
            var json = response.responseJSON;
            resolve(Campaign.fromJson(json['campaign']))
          },
          error: function(error) {
            reject(error)
          }
      });
    });

    return promise;
  }

  export function getBudget(budgetId: number): Promise<Budget> {
    var promise = new Promise<Budget>(
        (resolve, reject) => {
      $.ajax({
          url: this.src + '/api/budgets/' + budgetId,
          method: 'GET',
          data: {},
          complete: function(response) {
            var json = response.responseJSON;
            resolve(Budget.fromJson(json['budget']))
          },
          error: function(error) {
            reject(error)
          }
      });
    });

    return promise;
  }

  export function get(url: string): Promise<any> {
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
    return promise;
  }

  export function post(url: string, body: any): Promise<any> {
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
    return promise;
  }

}

export default Server;