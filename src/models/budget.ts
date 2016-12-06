import BudgetPace from './budget_pace'
import FlyerRun from './flyer_run'
import FlyerType from './flyer_type'
import moment = require('moment');

class Budget {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  autoOptimize: boolean = false;
  billableEngagements: number = 0;
  budgetType: string;
  campaignId: number;
  flippAllocation: number = 0;
  flyerRuns: FlyerRun[] = [];
  flyerTypes: FlyerType[] = [];
  fsas: string;
  budgetPaces: BudgetPace[] = [];
  premiumEngagements: number = 0;
  quota: number = 0;
  quotaFilled: number = 0;
  rolloverBudgetId: number = 0;
  spendingMode: string;
  merchantId: number;
  warnings: string[] = [];
  /* stats */
  flippFilled: number = 0;
  flyersFilled: number = 0;
  projectedFlippFill: number = 0;
  projectedFlyersFill: number = 0;

  static fromJson(json: any): Budget {
    var b = new Budget();

    b.id = json['id'];
    b.name = json['name'];
    b.startTime = json['start_time'];
    b.endTime = json['end_time'];
    b.autoOptimize = json['auto_optimize'];
    b.budgetType = json['budget_type'];
    b.campaignId = json['campaign_id'];
    b.flippAllocation = json['flipp_allocation'];
    b.fsas = json['fsas'];
    b.quota = json['quota'];
    b.rolloverBudgetId = json['rollover_budget_id'];
    b.spendingMode = json['spending_mode'];
    b.merchantId = json['merchant_id'];
    b.warnings = json['warnings'];

    for (var i = 0; i < json['flyer_runs'].length; i++) {
      b.flyerRuns.push(FlyerRun.fromJson(json['flyer_runs'][i]));
    }
    for (var i = 0; i < json['flyer_types'].length; i++) {
      b.flyerTypes.push(FlyerType.fromJson(json['flyer_types'][i]));
    }
    for (var i = 0; i < json['budget_paces'].length; i++) {
      b.budgetPaces.push(BudgetPace.fromJson(json['budget_paces'][i]))
    }

    b.billableEngagements = json['billable_egagements'];
    b.premiumEngagements = json['premium_engagements'];
    b.quotaFilled = json['quota_filled'];
    b.flippFilled = json['flipp_filled'];
    b.flyersFilled = json['flyers_filled'];
    b.projectedFlippFill = json['projected_flipp_fill'];
    b.projectedFlyersFill = json['projected_flyers_fill'];

    return b;
  }

  static fetch(id: number): Promise<Budget> {
    return new Promise<Budget>((resolve, reject) => {
      $.ajax({
        url: '/api/budgets/' + id,
        method: 'GET',
        complete: function(response) {
          var json = response.responseJSON;
          resolve(Budget.fromJson(json['budget']));
        },
        error: function(error) {
          reject(error);
        }
      })
    });
  }

  static serializeAndStringify(selector: any): string {
    var a = $(selector).serializeArray();

    // Convert form data to object
    var form_obj: any = {};
    form_obj["auto_optimize"] = false; // auto_optimize if unchecked
    $.each(a, function() {
      switch (this.name) {
        case "flyer_runs[]":
        case "flyer_types[]":
          // Must remove '[]' from name before sending, but HTML
          // form requires '[]' for  grouping purposes
          this.name = this.name.replace("[]", "");
          // Transform array of ids, to id 'objects'
          this.value = { "id": this.value };
          // These values should always be in an array
          if (form_obj[this.name] === undefined) {
            form_obj[this.name] = [];
          }
          break;
        case "start_time":
        case "end_time":
          this.value = new Date(this.value);
          break;
        case "auto_optimize":
          delete form_obj[this.name];  // delete init value, else creates array
          this.value = true;
          break;
        case "skip_validation":
          this.value = true;
          break;
        case "rollover_budget_id":
          // some browsers (Chrome) set unset values to "None"
          if (this.value == "None") {
            this.value = "";
          }
          break;
      }
      if (form_obj[this.name] !== undefined) {
        if (!form_obj[this.name].push) {
          form_obj[this.name] = [form_obj[this.name]];
        }
        form_obj[this.name].push(this.value || '');
      } else {
        form_obj[this.name] = this.value || '';
      }
    });

    // transform model into appropriate queriable params
    var budget_params: any = {};
    var bulk_budget_params: any = {};
    if (form_obj.bulk == 'on') {
      delete form_obj.bulk
      for (var key in form_obj) {
        if (key.match(/^bulk_/)) {
          bulk_budget_params[key] = form_obj[key];
        } else if (key == 'name' ||
                   key == 'start_time' ||
                   key == 'end_time') {
          bulk_budget_params['bulk_' + key] = form_obj[key];
        } else {
          budget_params[key] = form_obj[key];
        }
      }
    } else {
      budget_params = form_obj;
    }

    var request_res: any = { "budget": budget_params };
    if (!$.isEmptyObject(bulk_budget_params))
      request_res.bulk_create_params = bulk_budget_params;
    return JSON.stringify(request_res);
  }

  get flippQuota(): number {
    var allocation = Math.max(0, Math.min(this.flippAllocation, 1));
    return this.quota * allocation;
  }

  get flyersQuota(): number {
    return this.quota - this.flippQuota;
  }

  public budgetPaceHtml(): string {
    var str = '<ul>';
    str += this.budgetPaces.map(function(data) {
      return '<li>'
        + data.quota + ' ('
        + moment(data.startTime).format('YYYY/MM/DD HH:mm') + ' - '
        + moment(data.endTime).format('YYYY/MM/DD HH:mm') + ')</li>'
    }).join('');
    return str + '</ul>';
  }
}

export default Budget;