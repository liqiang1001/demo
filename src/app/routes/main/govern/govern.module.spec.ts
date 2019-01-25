import { GovernModule } from './govern.module';

describe('GovernModule', () => {
  let governModule: GovernModule;

  beforeEach(() => {
    governModule = new GovernModule();
  });

  it('should create an instance', () => {
    expect(governModule).toBeTruthy();
  });
});
