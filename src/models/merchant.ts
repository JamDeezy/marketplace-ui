import FlyerRun from './flyer_run'
import FlyerType from './flyer_type'

class Merchant {

  id: number;
  name: string;
  mp_ported: boolean;

  static fromJson(json: any): Merchant {
    var m = new Merchant();
    m.id = json['id'];
    m.name = json['name'];
    m.mp_ported = json['mp_ported'];

    return m;
  }

  static fetchFlyerRuns(merchantId: number, startTime?: string,
                          endTime?: string): Promise<Array<FlyerRun>> {
    return new Promise<Array<FlyerRun>>((resolve, reject) => {
      $.get(
        '/api/merchants/' + merchantId + '/flyer_runs',
        {
          'start_time': startTime,
          'end_time': endTime
        }
      ).done((response) => {
        resolve(response.flyer_runs.map(function(data: any) {
          return FlyerRun.fromJson(data);
        }));
      }).fail((error) => {
        reject(error);
      })
    });
  }

  static fetchFlyerTypes(merchantId: number): Promise<Array<FlyerType>> {
    return new Promise<Array<FlyerType>>((resolve, reject) => {
      $.get(
        '/api/merchants/' + merchantId + '/flyer_types'
      ).done((response) => {
        resolve(response.flyer_types.map(function(data: any) {
          return FlyerType.fromJson(data);
        }));
      }).fail(function(error) {
        reject(error);
      })
    });
  }
}

export default Merchant;