import { IS_PUBLIC_KEY, Public } from './public.decorator';

describe('Public Decorator', () => {
  it('should add metadata with isPublic key set to true', () => {
    @Public()
    class TestController {}

    const isPublic = Reflect.getMetadata(IS_PUBLIC_KEY, TestController);

    expect(isPublic).toBe(true);
  });

  it('should add metadata with isPublic key set to false', () => {
    class TestController {}

    const isPublic = Reflect.getMetadata(IS_PUBLIC_KEY, TestController);

    expect(isPublic).toBeUndefined();
  });
});
