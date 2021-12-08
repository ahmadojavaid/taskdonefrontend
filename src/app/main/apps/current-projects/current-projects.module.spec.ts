import { CurrentProjectsModule } from './current-projects.module';

describe('CurrentProjectsModule', () => {
  let currentProjectsModule: CurrentProjectsModule;

  beforeEach(() => {
    currentProjectsModule = new CurrentProjectsModule();
  });

  it('should create an instance', () => {
    expect(currentProjectsModule).toBeTruthy();
  });
});
