export interface DomainMeta {
  id: number;
  name: string;
  description: string;
  hashtag: string;
  rank: number;
}

export interface Domain {
  meta: DomainMeta;
}

export interface NewDomainPayload {
  id: number;
  domain: Domain;
}

export interface DeleteDomainPayload {
  id: number;
}

export interface UpdateDomainPayload {
  id: number;
  domainPatch: Partial<Domain>;
}
