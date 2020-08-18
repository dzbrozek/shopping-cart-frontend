import { fileToBase64 } from 'utils/files';

describe('files', () => {
  it('should test fileToBase64', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    expect(await fileToBase64(file)).toEqual('data:image/png;base64,aGVsbG8=');
  });
});
