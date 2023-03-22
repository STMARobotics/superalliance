import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

async function create(nick) {
    const avatar = createAvatar(initials, {
        seed: nick,
        backgroundColor: ["1e62a9"]
      })
      const svg = await avatar.toDataUri();
      return svg
}

export {
    create
}