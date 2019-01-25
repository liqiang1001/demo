import { RiskModule } from './risk.module';

describe('RiskModule', () => {
  let riskModule: RiskModule;

  beforeEach(() => {
    riskModule = new RiskModule();
  });

  it('should create an instance', () => {
    expect(riskModule).toBeTruthy();
  });
});
