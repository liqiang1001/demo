import { TaskMangementModule } from './task-mangement.module';

describe('TaskMangementModule', () => {
  let taskMangementModule: TaskMangementModule;

  beforeEach(() => {
    taskMangementModule = new TaskMangementModule();
  });

  it('should create an instance', () => {
    expect(taskMangementModule).toBeTruthy();
  });
});
