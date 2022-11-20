import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDentalResponse } from '../../../shared/services/apis/types/scratchpay.interface';
import { RequestContext } from '../../../utils/request-context';
import { ClinicRepository } from '../repositories/clinic.repository';
import { ClinicSearchQuery } from '../types/clinic-search.query';

/*
  Note: Which has responsible hanover input to repository, after get data from repository 
  which will process to match expectation data response
*/
@Injectable()
export class ClinicSearchHandler {
  @Inject() private readonly clinicRepository: ClinicRepository;
  private readonly logger = new Logger(ClinicSearchHandler.name);

  async execute(
    context: RequestContext,
    query: ClinicSearchQuery,
  ): Promise<IDentalResponse[]> {
    try {
      const clinics = await this.clinicRepository.getClinics(context, query);
      return <IDentalResponse[]>clinics;
    } catch (error) {
      const { correlationId } = context;
      this.logger.error({
        error,
        correlationId,
      });
      throw error;
    }
  }
}
