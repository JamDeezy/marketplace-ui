import Server from 'modules/server';
import CustomElement from 'modules/custom_element'
import Helper from 'modules/helper';

import Merchant from 'models/merchant';
import BudgetModel from 'models/budget';
import Campaign from 'models/campaign';
import FlyerType from 'models/flyer_type';
import FlyerRun from 'models/flyer_run';

import InputElement from 'f-input/f-input';


// @Definition
interface BudgetElement extends HTMLElement {
  campaignId: number;
  budgetId: number;
  data: BudgetModel;
  ready(callback: (data: BudgetModel) => any): void;
}


class Budget {
  constructor(private _element: BudgetElement) {};
  /* Meat of functionality */
  private _callback: (data: BudgetModel) => any;
  private _data: BudgetModel;

  private _autoOptimize: InputElement;
  private _budgetPaces: HTMLDivElement;
  private _budgetType: InputElement;
  private _bulk: InputElement;
  private _endTime: InputElement;
  private _flippAlloc: InputElement;
  private _flippQuota: InputElement;
  private _flyersList: HTMLDivElement;
  private _flyersQuota: InputElement;
  private _form: HTMLFormElement;
  private _fsas: InputElement;
  private _name: InputElement;
  private _paceDuration: InputElement;
  private _quota: InputElement;
  private _refreshType: InputElement;
  private _rolloverB: InputElement;
  private _skipValidation: InputElement;
  private _spendingMode: InputElement;
  private _startTime: InputElement;
  private _submit: InputElement;
  private _totalDays: HTMLDivElement;

  createdCallback() {
    /* On create (i.e new) */
    if (!this._element) Budget.call(this, this);

    if (this.budgetId || this.campaignId) {
      this._fetch();
    }
  }

  set campaignId(newId: number) {
    this._element.setAttribute('campaign-id', '' + newId);
    this._element.removeAttribute('budget-id');
    this._fetch();
  }


  get campaignId(): number {
    return parseInt(this._element.getAttribute('campaign-id'));
  }


  set budgetId(newId: number) {
    this._element.setAttribute('budget-id', '' + newId);
    this._element.removeAttribute('campaign-id');
    this._fetch();
  }


  get budgetId(): number {
    return parseInt(this._element.getAttribute('budget-id'));
  }


  get data(): BudgetModel {
    return this._data;
  }


  public ready(callback: (data: BudgetModel) => any) {
    this._callback = callback;
  }


  private _fetch() {
    if (this.budgetId) {
      debugger;
      this._render(false);

      BudgetModel.fetch(this.budgetId).then((data) => {
        this._data = data;

        this._autoOptimize.checked = data.autoOptimize;
        this._budgetType.value = data.budgetType;
        this._endTime.value = data.endTime;
        this._flippAlloc.value = data.flippAllocation.toString();
        this._flippQuota.value = data.flippQuota.toString();
        this._flyersQuota.value = data.flyersQuota.toString();
        this._fsas.value = data.fsas;
        this._name.value = data.name;
        this._quota.value = data.quota.toString();
        this._spendingMode.value = data.spendingMode;
        this._startTime.value = data.startTime;

        if (data.spendingMode == 'paced') {
          this._budgetPaces.style.display = 'block';
          $(this._budgetPaces).append(data.budgetPaceHtml());
        }

        this._spendingMode.disabled = true;
        this._setTotalDays();
        this._set_handlers(false)
        this._getRolloverBudgets(data.campaignId, data.rolloverBudgetId);

        this._callback(this._data);
      });
    }
    else if(this.campaignId) {
      this._render(true);
      this._bulk.style.display = 'block';

      /*
       * Firefox has trouble mutating properties of objects
       * so components are loaded slower. This is a horrible hack but works
       */
      setTimeout(() => {
        this._startTime.value = moment().add(1, 'days')
          .startOf('day').format('YYYY[/]MM[/]DD HH[:]mm');
        this._endTime.value = moment().add(7, 'days')
          .endOf('day').format('YYYY[/]MM[/]DD HH[:]mm');
        this._setTotalDays();
        this._getRolloverBudgets(this.campaignId);
        this._set_handlers(true);
      }, 150);

    } else {
      console.error("Budget did not receive a valid id!");
    }
  }


  private _render(newBudget: boolean) {
    this._element.innerHTML = ''
    CustomElement.insertFragment(this,
      template({submit: (newBudget) ? "CREATE" : "SAVE"})
    )

    this._autoOptimize = Helper.getChild(this._element, '[name=auto_optimize]');
    this._budgetPaces = Helper.getChild(this._element, '[name=budget_paces]');
    this._budgetType = Helper.getChild(this._element, '[name=budget_type]');
    this._bulk = Helper.getChild(this._element, '[name=bulk]');
    this._endTime = Helper.getChild(this._element, '[name=end_time]');
    this._flippAlloc = Helper.getChild(this._element, '[name=flipp_allocation]');
    this._flippQuota = Helper.getChild(this._element, '[name=flipp_quota]');
    this._flyersQuota = Helper.getChild(this._element, '[name=flyers_quota]');
    this._flyersList = Helper.getChild(this._element, '[name=flyers_list]');
    this._form = Helper.getChild(this._element, '[name=form]');
    this._fsas = Helper.getChild(this._element, '[name=fsas]');
    this._name = Helper.getChild(this._element, '[name=name]');
    this._paceDuration = Helper.getChild(this._element, '[name=pace_duration]');
    this._quota = Helper.getChild(this._element, '[name=quota]');
    this._refreshType = Helper.getChild(this._element, '[name=refresh_type]');
    this._rolloverB = Helper.getChild(this._element, '[name=rollover_budget_id]');
    this._skipValidation = Helper.getChild(this._element, '[name=skip_validation]');
    this._spendingMode = Helper.getChild(this._element, '[name=spending_mode]');
    this._startTime = Helper.getChild(this._element, '[name=start_time]');
    this._submit = Helper.getChild(this._element, '[name=submit]');
    this._totalDays = Helper.getChild(this._element, '[name=total_days]');
  }


  private _set_handlers(newBudget: boolean) {
    var url = (newBudget) ?
      '/api/campaigns/' + this.campaignId + '/budgets' :
      '/api/budgets/' + this.budgetId
    var type = (newBudget) ? 'POST' : 'PUT'
    var that = this;

    /* Change total day length on start/end time */
    $(this._startTime).on('change', () => { this._setTotalDays(); });
    $(this._endTime).on('change', () => { this._setTotalDays(); });

    /* Change flipp and flyers quota on quota change */
    $(this._quota).on('input propertychange paste', function() {
      if (!that._autoOptimize.disabled) {
        that._flippQuota.value = (parseFloat(this.value)
          * parseFloat(that._flippAlloc.value)).toFixed(2).toString();
        that._flyersQuota.value = (parseFloat(this.value)
          * (1 - parseFloat(that._flippAlloc.value))).toFixed(2).toString();
      }
    });

    /* Change flipp and flyers quota on flipp allocation change */
    $(this._flippAlloc).on('input propertychange paste', function() {
      that._flippQuota.value = (parseFloat(this.value)
        * parseFloat(that._quota.value)).toFixed(2).toString();
      that._flyersQuota.value = ((1 - parseFloat(this.value))
        * parseFloat(that._quota.value)).toFixed(2).toString();
    });

    /* Change flyers quota and flipp allocation on flyers quota change*/
    $(this._flippQuota).on('input propertychange paste', function() {
      that._flyersQuota.value = (parseFloat(that._quota.value)
        - parseFloat(that._flippQuota.value)).toFixed(2).toString();
      that._flippAlloc.value = (parseFloat(that._flippQuota.value) /
        parseFloat(that._quota.value)).toString();
    });

    /* Change flipp quota and flipp allocation on flyers quota change*/
    $(this._flyersQuota).on('input propertychange paste', function() {
      that._flippQuota.value = (parseFloat(that._quota.value)
        - parseFloat(that._flyersQuota.value)).toFixed(2).toString();
      that._flippAlloc.value = (parseFloat(that._flippQuota.value) /
        parseFloat(that._quota.value)).toString();
    });

    /* Hide/show pace duration on spending mode change */
    $(this._spendingMode).change(function() {
      if (this.value == 'asap') {
        that._paceDuration.style.display = 'none';
        that._paceDuration.disabled = true;
      } else {
        that._paceDuration.style.display = 'block';
        that._paceDuration.disabled = false;
      }
    })

    /* Enable/disable fields on auto optimize change */
    $(this._autoOptimize).on('change', function () {
      that._flippAlloc.disabled = this.checked;
      that._flippQuota.disabled = this.checked;
      that._flyersQuota.disabled = this.checked;
    });
    $(this._autoOptimize).change(); // manual trigger

    /* No way around this, I'm sorry */
    if (newBudget) {
      /* Need to fetch the merchant id since we don't have that information
         at this point, this double call is a great example of why we should
         have a centralized server */
      Campaign.fetch(this.campaignId).then((data) => {
        var refreshHandler = function(event: any) {
          event.preventDefault();
          var value = that._budgetType.value;

          if (value == 'flyer_type') {
            that._getFlyerTypes(data.merchantId, []);
          }
          else if (value == 'flyer_run') {
            that._getFlyerRuns(data.merchantId, [],
              that._startTime.value, that._endTime.value);
          } else {
            that._flyersList.innerHTML = '';
          }
        }

        $(this._budgetType).on('change', refreshHandler);
        $(this._refreshType).on('click', refreshHandler);
      })
    }
    else {
      var refreshHandler = function(event: any) {
        event.preventDefault(event);
        var value = that._budgetType.value;

        if (value == 'flyer_type') {
          var flyerTypes =
            that._data.flyerTypes.map(function(i) { return i.id; });
          that._getFlyerTypes(that._data.merchantId, flyerTypes);
        }
        else if (value == 'flyer_run') {
          var flyerRuns =
            that._data.flyerRuns.map(function(i) { return i.id });
          that._getFlyerRuns(that._data.merchantId, flyerRuns,
            that._startTime.value, that._endTime.value);
        }
        else {
          that._flyersList.innerHTML = '';
        }
      };

      $(this._budgetType).on('change', refreshHandler);
      $(this._refreshType).on('click', refreshHandler);
      $(this._budgetType).change();  // manual trigger
    }

    $(this._bulk).on('click', function() {
      if (this.checked) {
        $(that._form).find('[type=bulk]').css('display', 'flex');
        $(that._form).find('f-input[name=bulk_frequency]')
            .prop('disabled', false);
        $(that._form).find('f-input[name=bulk_auto_rollover]')
            .prop('disabled', false);
        url = '/api/campaigns/' + that.campaignId + '/bulk_budgets'
      } else {
        $(that._form).find('[type=bulk]').css('display', 'none');
        $(that._form).find('f-input[name=bulk_frequency]')
            .prop('disabled', true);
        $(that._form).find('f-input[name=bulk_auto_rollover]')
            .prop('disabled', true);
        url = '/api/campaigns/' + that.campaignId + '/budgets'
      }
    });

    $(this._form).find('f-input[name=bulk_frequency]')
      .on('change', function() {
        if (this.value == 'custom') {
          $(that._form)
            .find('f-input[name=bulk_duration]')
            .prop('disabled', false);
        } else {
          $(that._form)
            .find('f-input[name=bulk_duration]')
            .prop('disabled', true);
        }
      });

    $(this._form).on('submit', (event) => {
      event.preventDefault();
      this._submit.disabled = true;

      $.ajax(url, {
        type: type,
        contentType: "application/json",
        data: BudgetModel.serializeAndStringify(this._form)
      }).done((data) => {
        if (data.budgets) {
          Helper.pjaxGoToPage("/campaign?id=" + this.campaignId);
        } else {
          Helper.pjaxGoToPage("/budget?id=" + data.budget.id);
        }
      }).fail((data) => {
        console.error(data.responseText);
        var errors = data.responseJSON.errors;
        if (typeof errors !== 'undefined' && errors.length > 0)
          alert(errors.join('\n\n'));
        else
          alert("Unknown error occured.  Please contact administrators.");
        this._submit.disabled = false;
      });
    });
  }

  /* Get roll over budgets and insert into DOM */
  private _getRolloverBudgets(campaignId: number, rolloverId?: number) {
    $.ajax('/api/campaigns/' + campaignId + '/budgets').done((data) => {
      var $select = $(this._element)
        .find('select[name=rollover_budget_id]');

      $select.html('').append($('<option>').text("None"));
      $.each(data.budgets, function(i, v) {
        $select.append($("<option>")
          .attr("value", v.id)
          .text(v.id + ' ' + v.name));
      });

      if (rolloverId) this._rolloverB.value = rolloverId.toString();
    }).fail(() => {
      console.error("error getting roll over budgets");
    });
  }

  /* Get Flyer Runs and insert into DOM */
  private _getFlyerRuns(merchantId: number, checkedFlyerRuns: number[],
                          startTime: string, endTime: string) {
    Merchant.fetchFlyerRuns(merchantId, startTime, endTime).then((data) => {
      var $flyerList = $(this._flyersList);
      $flyerList.html('');

      var hidden_desc = ['promoted', 'hidden', 'not-promoted'];
      data.forEach((fr: any) => {
        // Only display deleted flyer runs if budget
        // is associated with that run already
        var associated_run: boolean = checkedFlyerRuns.indexOf(fr.id) >= -1
        if (fr.deleted && !associated_run) return;

        var span_str =
          moment(fr.availableFrom).format('YY/MM/DD HH:mm') + ' to ' +
          moment(fr.availableTo).format('YY/MM/DD HH:mm') + ' | ' +
          'native = ' + hidden_desc[fr.hideInDistribution] + ' | ' +
          'flipp = ' + hidden_desc[fr.hideInFlipp];

        var $el = $('<f-input>')
          .attr('type', 'checkbox')
          .attr('label', fr.name + ' (' + fr.id + ')')
          .attr('description', span_str)
          .attr('value', fr.id)
          .attr('name', 'flyer_runs[]')
          .attr('deleted', fr.deleted)

        $flyerList.append($el)
        if (associated_run) $el.prop('checked', true);
      });

      if (data.length == 0)
        $flyerList.html(
          'No flyer-run is available during the specified time period');
    });
  }

  /* Get Flyer Types and insert into DOM */
  private _getFlyerTypes(merchantId: number, checkedFlyerTypes: number[]) {
    Merchant.fetchFlyerTypes(merchantId).then((data) => {
      var $flyerList = $(this._flyersList);
      $flyerList.html('');

      data.forEach((ft: FlyerType) => {
        // Only display deleted flyer type if budget
        // is associated with that type already
        var associated_type: boolean = checkedFlyerTypes.indexOf(ft.id) >= 0
        if (ft.deleted && !associated_type) return;

        var $el = $('<f-input>')
          .attr('type', 'checkbox')
          .attr('label', ft.name + ' (' + ft.id + ')')
          .attr('value', ft.id)
          .attr('name', 'flyer_types[]')
          .attr('deleted', "" + ft.deleted)

        $flyerList.append($el)
        if (associated_type) $el.prop('checked', true);
      });

      if (data.length == 0)
        $flyerList.html("No flyer types available");
    });
  }

  /* Get budget length and insert into DOM */
  private _setTotalDays() {
    var startTime = Date.parse(this._startTime.value);
    var endTime = Date.parse(this._endTime.value);
    var dayDiff = Math.floor((endTime - startTime) / (1000 * 86400));
    this._totalDays.innerHTML = (isNaN(dayDiff) ? 0 : dayDiff) + ' Days';
  }
} /* End of class Budget */


// @Export
var style    = require('./f-budget.scss');
var template = require('./f-budget.handlebars');

var BudgetElement =
    CustomElement.registerElement('f-budget', HTMLElement, Budget);

export default BudgetElement;