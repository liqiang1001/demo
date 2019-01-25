import { OnsiteModule } from './onsite.module';

describe('OnsiteModule', () => {
  let onsiteModule: OnsiteModule;

  beforeEach(() => {
    onsiteModule = new OnsiteModule();
  });

  it('should create an instance', () => {
    expect(onsiteModule).toBeTruthy();
  });
});
