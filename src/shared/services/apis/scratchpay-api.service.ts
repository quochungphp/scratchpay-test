import { Injectable, Logger } from '@nestjs/common';
import { RequestContext } from '../../../utils/request-context';
import { EnvConfig } from '../../configs/env.config';
import { BaseApiService } from './base-api.service';
import { IDentalResponse, IVetResponse } from './types/scratchpay.interface';

@Injectable()
export class ScratchpayApiService extends BaseApiService {
  private readonly logger = new Logger(ScratchpayApiService.name);
  constructor(envConfig: EnvConfig) {
    super(envConfig.fakeBaseUrl(), envConfig);
  }
  async getDentalClinics(context: RequestContext): Promise<IDentalResponse[]> {
    try {
      const response = await this.get(
        context,
        '/scratchpay-code-challenge/dental-clinics.json',
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      const { correlationId } = context;
      const msg = 'Exception error in ScratchpayApiService.getDentalClinics';
      this.logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }

  async getVetClinics(context: RequestContext): Promise<IVetResponse[]> {
    try {
      const response = await this.get(
        context,
        '/scratchpay-code-challenge/vet-clinics.json',
      );
      return response?.data;
    } catch (error) {
      const { correlationId } = context;
      const msg = 'Exception error in ScratchpayApiService.getVetClinics';
      this.logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }
}
