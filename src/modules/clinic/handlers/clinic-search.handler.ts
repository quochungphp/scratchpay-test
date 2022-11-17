import {
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { RequestContext } from '../../../utils/request-context';
import { ClinicRepository } from '../repositories/clinic.repository';

@Injectable()
export class ClinicSearchHandler {
  @Inject() private readonly clinicRepository: ClinicRepository;
  private readonly logger = new Logger(ClinicSearchHandler.name);

  async execute(context: RequestContext): Promise<any> {
    try {
      const clinics = await this.clinicRepository.getClinics(context);

      if (clinics.length == 0) {
        throw new NotAcceptableException('Clinic was emptied');
      }

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
