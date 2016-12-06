class BudgetPace {
  budgetId: number;
  endTime: string;
  id: number;
  quota: number;
  startTime: string;

  static fromJson(json: any): BudgetPace {
    var bp = new BudgetPace();
    bp.budgetId = json['budget_id'];
    bp.endTime = json['end_time'];
    bp.id = json['id'];
    bp.quota = json['quota'];
    bp.startTime = json['start_time'];
    return bp;
  }
}

export default BudgetPace;