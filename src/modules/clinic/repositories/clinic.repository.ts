/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import { ScratchpayApiService } from '../../../shared/services/apis/scratchpay-api.service';
import {
  IDentalResponse,
  IVetResponse,
} from '../../../shared/services/apis/types/scratchpay.interface';
import { RequestContext } from '../../../utils/request-context';
import { ClinicSearchQuery } from '../types/clinic-search.query';

@Injectable()
export class ClinicRepository {
  @Inject() private readonly scratchpayApiService: ScratchpayApiService;

  async getClinics(
    context: RequestContext,
    query: ClinicSearchQuery,
  ): Promise<(IDentalResponse | IVetResponse)[]> {
    const [dental, vet] = await Promise.all([
      this.scratchpayApiService.getDentalClinics(context),
      this.scratchpayApiService.getVetClinics(context),
    ]);
    const replaceVet = JSON.stringify(vet)
      .replace(/clinicName/g, 'name')
      .replace(/stateCode/g, 'stateName')
      .replace(/opening/g, 'availability');
    const data = [...dental, ...JSON.parse(replaceVet)];

    return this.searchEngine(query, data);
  }

  private searchEngine(
    query: ClinicSearchQuery,
    data: IDentalResponse[],
  ): IDentalResponse[] {
    const { name, stateName, from, to } = query;
    const result: IDentalResponse[] = [];
    if (stateName && stateName.length > 0) {
      const search = data.filter((item) =>
        item.stateName.toLowerCase().includes(stateName),
      );
      result.push(...search);
    }

    if (name.length > 0) {
      const search = data.filter((item) =>
        item.name.toLowerCase().includes(name),
      );
      result.push(...search);
    }

    return result.filter(function (item, pos) {
      return result.indexOf(item) == pos;
    });
  }
}
