import { Inject, Injectable, Logger } from '@nestjs/common';
import { RequestContext } from '../../../utils/request-context';
import { ClinicRepository } from '../repositories/clinic.repository';
import { ClinicSearchQuery } from '../types/clinic-search.query';

@Injectable()
export class ClinicSearchHandler {
  @Inject() private readonly clinicRepository: ClinicRepository;
  private readonly logger = new Logger(ClinicSearchHandler.name);

  async execute(
    context: RequestContext,
    query: ClinicSearchQuery,
  ): Promise<any> {
    try {
      const clinics = await this.clinicRepository.getClinics(context, query);
      return clinics;
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
