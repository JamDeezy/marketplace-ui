import ServerElement from './f-marketplace-server';
import marketplace from './f-marketplace-base';
import Merchant from './f-marketplace-merchant';
import BudgetModel from './f-marketplace-budget-model';
import CampaignModel from './f-marketplace-campaign-model';


require('stylesheets/f-breadcrumbs.scss');

class Breadcrumbs {

  constructor(private _element: BreadcrumbsElement) {}

  private _server: ServerElement;

  createdCallback() {
    if (!this._element) {
      Breadcrumbs.call(this, this);
    }

    this._server = <ServerElement>document
      .querySelector('f-marketplace-server')

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
      var campaign: CampaignModel, budget: BudgetModel;
      this._server.getBudget(this.budgetId)
      .then((b) => {
        budget = b;
        return this._server.getCampaign(budget.campaignId);
      })
      .then((c) => {
        campaign = c;
        return this._server.getMerchant(campaign.merchantId);
      })
      .then((merchant) => {
        this._render(merchant, campaign, budget);
      });
    } else if (this.campaignId) {
      var campaign: CampaignModel;
      this._server.getCampaign(this.campaignId)
      .then((c) => {
        campaign = c;
        return this._server.getMerchant(campaign.merchantId);
      })
      .then((merchant) => {
        this._render(merchant, campaign);
      });
    } else if (this.merchantId) {
      this._server.getMerchant(this.merchantId)
      .then((merchant) => {
        this._render(merchant);
      });
    }
  }

  private _render(merchant?: Merchant, campaign?: CampaignModel, budget?: BudgetModel) {
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
    this._element.appendChild(
      marketplace.createDocumentFragment(template(viewModel))
     );
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

}

var template = require('templates/f-breadcrumbs.handlebars');

var BreadcrumbsElement =
    marketplace.registerElement('f-breadcrumbs', HTMLElement, Breadcrumbs);

interface BreadcrumbsElement extends HTMLElement {
  merchantId: number;
  campaignId: number;
  budgetId: number;
}

export default BreadcrumbsElement;
