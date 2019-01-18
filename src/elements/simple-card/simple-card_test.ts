/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const { assert } = chai;

import { doubleRaf } from '../../utils/double-raf.js';
import { SimpleCard } from './simple-card.js';
customElements.define(SimpleCard.defaultTagName, SimpleCard);

describe('SimpleCard', () => {
  afterEach(() => {
    const cards = document.body.querySelectorAll(SimpleCard.defaultTagName);
    for (const card of cards) {
      card.remove();
    }
  });

  it('renders custom messages', async () => {
    const card = new SimpleCard();
    const message = 'Foo bar!';
    card.src = message;
    document.body.appendChild(card);

    await doubleRaf();
    assert(card.shadowRoot!.querySelector('#container')!.textContent, message);
  });

  it('rerenders on message change', async () => {
    const card = new SimpleCard();
    const message1 = 'Foo bar!';
    const message2 = 'Bar foo!';

    card.src = message1;
    document.body.appendChild(card);

    const container = card.shadowRoot!.querySelector('#container')!;
    await doubleRaf();
    assert(container.textContent, message1);

    card.src = message2;
    assert(container.textContent, message2);
  });

  it('removes itself on close', (done) => {
    const card = new SimpleCard();
    document.body.appendChild(card);

    requestAnimationFrame(async () => {
      await card.close(100);

      setTimeout(() => {
        assert.equal(card.parentNode, null);
        done();
      }, 150);
    });
  });

  it('removes itself immediately when duration is 0', (done) => {
    const card = new SimpleCard();
    document.body.appendChild(card);

    requestAnimationFrame(async () => {
      await card.close();
      assert.equal(card.parentNode, null);
      done();
    });
  });

  it('closes when the close button is clicked', async () => {
    const card = new SimpleCard();
    card.fadeDuration = 0;
    document.body.appendChild(card);

    // Wait for the render.
    await doubleRaf();

    const close =
        card.shadowRoot!.querySelector('#close') as HTMLButtonElement;
    close.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    assert.isNull(card.parentNode, 'Parent node is not null');
  });

  it('does not closes when clicked', async () => {
    const card = new SimpleCard();
    card.fadeDuration = 0;
    document.body.appendChild(card);

    // Wait for the render.
    await doubleRaf();

    card.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    assert.isNotNull(card.parentNode);
  });

  it('allows the setting of width', async () => {
    const card = new SimpleCard();
    card.style.setProperty('--padding', '0');
    card.width = 500;
    document.body.appendChild(card);

    assert.equal(card.getBoundingClientRect().width, 500);
    assert.equal(card.width, 500);
  });

  it('allows the setting of height', async () => {
    const card = new SimpleCard();
    card.style.setProperty('--padding', '0');
    card.height = 500;
    document.body.appendChild(card);
    assert.equal(card.getBoundingClientRect().height, 500);
    assert.equal(card.height, 500);
  });

  it('supports embedding iframe content', async () => {
    const card = new SimpleCard();
    card.src = new URL('about:blank');
    document.body.appendChild(card);
    assert.isNotNull(card.shadowRoot!.querySelector('iframe'));
  });
});