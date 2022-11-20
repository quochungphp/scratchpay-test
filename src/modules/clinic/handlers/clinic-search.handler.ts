import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDentalResponse } from '../../../shared/services/apis/types/scratchpay.interface';
import {
  REDIS_CACHE_1_HOURS,
  REDIS_CACHE_5_MINS,
} from '../../../shared/services/redis/types/redis.type';
import { redisCacheKey } from '../../../utils/generate-key';
import { RequestContext } from '../../../utils/request-context';
import { ClinicRepository } from '../repositories/clinic.repository';
import { ClinicSearchQuery } from '../types/clinic-search.query';
import * as md5 from 'md5';
import { RedisCacheService } from '../../../shared/services/redis/redis-cache.service';
/*
  Note: Which has responsible hanover input to repository, after get data from repository 
  which will process to match expectation data response
*/
@Injectable()
export class ClinicSearchHandler {
  @Inject() private readonly clinicRepository: ClinicRepository;

  @Inject() private readonly redisCacheService: RedisCacheService;
  private readonly logger = new Logger(ClinicSearchHandler.name);

  async execute(
    context: RequestContext,
    query: ClinicSearchQuery,
  ): Promise<IDentalResponse[]> {
    try {
      const key = redisCacheKey(`search-clinic:${md5(JSON.stringify(query))}`);

      const results = await this.redisCacheService.softGetOrSet(
        key,
        async () => this.clinicRepository.getClinics(context, query),
        REDIS_CACHE_5_MINS,
        REDIS_CACHE_5_MINS,
      );
      return <IDentalResponse[]>results;
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
