import * as React from 'react';
import classNames from 'classnames';
import { InputAmountWithDaysProps } from './types';

export const InputAmountWithDuration = ({
  name,
  label,
  selectInputName,
  isRequired,
  className,
  handleChange,
  handleSelectChange,
  disabled,
  ...props
}: InputAmountWithDaysProps) => {
  return (
    <div>
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <div className="relative flex">
        <input
          className={classNames('input-field', className)}
          name={name}
          id={name}
          required={isRequired}
          autoComplete="off"
          autoCorrect="off"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder="0.0"
          minLength={1}
          maxLength={79}
          spellCheck="false"
          inputMode="decimal"
          title="Enter numbers only."
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <label htmlFor={selectInputName} className="sr-only">
          Stream Duration
        </label>
        <select
          name={selectInputName}
          id={selectInputName}
          required={isRequired}
          className="absolute right-1 bottom-1 top-2 my-auto flex w-full max-w-[24%] items-center truncate rounded border-lp-gray-1 pr-4 text-sm shadow-sm dark:border-lp-gray-2 dark:bg-lp-gray-5"
          style={{ backgroundSize: '1.25rem', backgroundPosition: 'calc(100% - 4px) 55%' }}
          onChange={handleSelectChange}
          defaultValue="month"
          disabled={disabled}
        >
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </div>
    </div>
  );
};
