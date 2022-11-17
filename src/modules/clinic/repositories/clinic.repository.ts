import { Inject, Injectable } from '@nestjs/common';
import { ScratchpayApiService } from '../../../shared/services/apis/scratchpay-api.service';
import {
  IDentalResponse,
  IVetResponse,
} from '../../../shared/services/apis/types/scratchpay.interface';
import { RequestContext } from '../../../utils/request-context';

@Injectable()
export class ClinicRepository {
  @Inject() private readonly scratchpayApiService: ScratchpayApiService;

  async getClinics(
    context: RequestContext,
  ): Promise<(IDentalResponse | IVetResponse)[]> {
    const [dental, vet] = await Promise.all([
      this.scratchpayApiService.getDentalClinics(context),
      this.scratchpayApiService.getVetClinics(context),
    ]);

    return [...dental, ...vet];
  }
}
