import Server from 'modules/server';
import CustomElement from 'modules/custom_element';

import Merchant from 'models/merchant';
import Budget from 'models/budget';
import Campaign from 'models/campaign';


// @Definition
interface BreadcrumbsElement extends HTMLElement {
  merchantId: number;
  campaignId: number;
  budgetId: number;
}


class Breadcrumbs {

  constructor(private _element: BreadcrumbsElement) {}

  createdCallback() {
    if (!this._element) {
      Breadcrumbs.call(this, this);
    }

    this._fetch();
  }

  attributeChangedCallback(attr: string, old: string, value: string) {
    if (attr === 'budget-id' ||
        attr === 'campaign-id' ||
        attr === 'merchant-id') {
      this._fetch();
    }
  }

  private _fetch() {
    if (this.budgetId) {
      var campaign: Campaign, budget: Budget;
      Server.getBudget(this.budgetId)
      .then((b) => {
        budget = b;
        return Server.getCampaign(budget.campaignId);
      })
      .then((c) => {
        campaign = c;
        return Server.getMerchant(campaign.merchantId);
      })
      .then((merchant) => {
        this._render(merchant, campaign, budget);
      });
    } else if (this.campaignId) {
      var campaign: Campaign;
      Server.getCampaign(this.campaignId)
      .then((c) => {
        campaign = c;
        return Server.getMerchant(campaign.merchantId);
      })
      .then((merchant) => {
        this._render(merchant, campaign);
      });
    } else if (this.merchantId) {
      Server.getMerchant(this.merchantId)
      .then((merchant) => {
        this._render(merchant);
      });
    }
  }

  private _render(merchant?: Merchant, campaign?: Campaign, budget?: Budget) {
    var viewModel: any = {};

    if (merchant) {
      viewModel.merchant = merchant.name;
      viewModel.merchantId = merchant.id;
      viewModel.ported = merchant.mp_ported
    }

    if (campaign) {
      viewModel.campaign = campaign.name;
      viewModel.campaignId = campaign.id;
    }

    if (budget) {
      viewModel.budget = budget.name;
      viewModel.budgetId = budget.id;
    }

    this._element.innerHTML = '';
    CustomElement.insertFragment(this, template(viewModel));
  }

  get merchantId(): number {
    return +this._element.getAttribute('merchant-id')
  }

  set merchantId(value: number) {
    this._element.setAttribute('merchant-id', value.toString());
  }

  get campaignId(): number {
    return +this._element.getAttribute('campaign-id')
  }

  set campaignId(value: number) {
    this._element.setAttribute('campaign-id', value.toString());
  }

  get budgetId(): number {
    return +this._element.getAttribute('budget-id')
  }

  set budgetId(value: number) {
    this._element.setAttribute('budget-id', value.toString());
  }

} // class Breadcrumbs


// @Export
var style    = require('./f-breadcrumbs.scss');
var template = require('./f-breadcrumbs.handlebars');

var BreadcrumbsElement =
    CustomElement.registerElement('f-breadcrumbs', HTMLElement, Breadcrumbs);

export default BreadcrumbsElement;
