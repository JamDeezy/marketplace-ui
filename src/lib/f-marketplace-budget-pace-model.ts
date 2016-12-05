class BudgetPaceModel {
  budgetId: number;
  endTime: string;
  id: number;
  quota: number;
  startTime: string;

  static fromJson(json: any): BudgetPaceModel {
    var bp = new BudgetPaceModel();
    bp.budgetId = json['budget_id'];
    bp.endTime = json['end_time'];
    bp.id = json['id'];
    bp.quota = json['quota'];
    bp.startTime = json['start_time'];
    return bp;
  }
}

export default BudgetPaceModel;