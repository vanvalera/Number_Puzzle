import './App.scss';
import Input from 'antd/es/input/Input';
import { Button, Spin } from 'antd';
import { useState } from 'react';

export function App() {
  const [inputValue, setInputValue] = useState('');

  const [result, setResult] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  function canConnect(fragment1, fragment2) {
    return fragment1.slice(-2) === fragment2.slice(0, 2);
  }

  function findChain(fragment, remainingFragments, currentChain) {
    let maxChain = currentChain;

    for (let i = 0; i < remainingFragments.length; i += 1) {
      const nextFragment = remainingFragments[i];

      if (canConnect(fragment, nextFragment)) {
        const newRemaining = remainingFragments.slice();

        newRemaining.splice(i, 1);

        const newChain = currentChain + nextFragment.slice(2);
        const extendedChain = findChain(nextFragment, newRemaining, newChain);

        if (extendedChain.length > maxChain.length) {
          maxChain = extendedChain;
        }
      }
    }

    return maxChain;
  }

  function buildLongestSequence(fragments) {
    let maxSequence = '';

    for (let i = 0; i < fragments.length; i += 1) {
      const remainingFragments = fragments.slice();

      const startFragment = fragments[i];

      const chain = findChain(
        startFragment,

        remainingFragments.slice(0, i).concat(remainingFragments.slice(i + 1)),

        startFragment,
      );

      if (chain.length > maxSequence.length) {
        maxSequence = chain;
      }
    }

    return maxSequence;
  }

  const handleButtonClick = () => {
    setError('');

    setLoading(true);

    setTimeout(() => {
      const input = inputValue.trim();

      const isNumber = /^[0-9]+$/.test(input);

      if (!isNumber) {
        setError('Введіть тільки числа без пробілів');

        setLoading(false);

        return;
      }

      const fragments = [];

      if (input.length % 6 === 0) {
        for (let i = 0; i < input.length; i += 6) {
          fragments.push(input.slice(i, i + 6));
        }

        const longestSequence = buildLongestSequence(fragments);

        setResult(longestSequence || 'Невозможно составить цепочку.');

        setLoading(false);
      } else {
        setResult('Введіть число кратне 6.');

        setLoading(false);
      }
    }, 300);
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <p>
        Чи любите ви пазли? Давайте складемо з вами цифровий пазл, де елементами
        з&apos;єднання будуть перші або останні ДВІ цифри. Кожен пазл довжиною 6
        цифр і може бути використані лише 1 раз.
      </p>
      <form>
        <Input
          placeholder="Введіть число кратно 6"
          value={inputValue}
          onChange={e => setInputValue(e.target.value.replace(/[\s,]+/g, ''))}
        />
        <Button type="primary" onClick={handleButtonClick}>
          Розрахувати пазл
        </Button>
      </form>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>} <p>{result}</p>
        </>
      )}
    </div>
  );
}
