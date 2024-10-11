


// services/ApprovedRequestService.ts
import ApiService from './GenericService/ApiService';
import { ApprovedRequestUpdate } from '../types/ApprovedRequestsUpdate';

class ApprovedRequestService extends ApiService<ApprovedRequestUpdate> {
  post: any;
  
  
  public updateApprovedRequest(data: ApprovedRequestUpdate) {
    return this.post(`/Residents/fromApplicant`, data); 
  }
}

const approvedRequestService = new ApprovedRequestService();
export default approvedRequestService;
