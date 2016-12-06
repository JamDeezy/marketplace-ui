class Campaign {
  id: number;
  name: string;
  opportunityId: string;
  enabled: boolean;
  invoiced: boolean;
  invoiceSeparately: boolean;
  freshbooksClientId: string;
  startTime: string;
  endTime: string;
  quota: number;
  quotaFilled: number;
  merchantId: number;

  static fromJson(json: any): Campaign {
    var c = new Campaign();
    c.id = json['id'];
    c.name = json['name'];
    c.opportunityId = json['sf_opportunity_id'];
    c.enabled = json['enabled'];
    c.invoiced = json['invoiced'];
    c.invoiceSeparately = json['invoice_separately'];
    c.freshbooksClientId = json['freshbooks_client_id'];
    c.startTime = json['start_time'];
    c.endTime = json['end_time'];
    c.quota = json['quota'];
    c.quotaFilled = json['quota_filled'];
    c.merchantId = json['merchant_id'];
    return c;
  }

  static fetch(id: number): Promise<Campaign> {
    return new Promise<Campaign>((resolve, reject) => {
      $.ajax({
        url: '/api/campaigns/' + id,
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
  }

  static serializeAndStringify(selector: any): string {
    var o: any = {};
    var a = $(selector).serializeArray();
    /* Default campaign enabled always true,
       TODO: When we use enabled flag, uncomment and set this to false */
    o["enabled"] = true;
    $.each(a, function() {
      // switch (this.name) {
      //   case "enabled":
      //     delete o[this.name];
      //     this.value = true;
      //     break;
      // }
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return JSON.stringify({ "campaign": o });
  }
}

export default Campaign;