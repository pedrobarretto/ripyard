'use client';
import { Input, ResponsiveValue } from '@chakra-ui/react';
import { HTMLInputTypeAttribute } from 'react';

interface CustomInputProps {
  placeholder: string;
  value: string | number;
  setValue: (x: any) => void;
  width?: ResponsiveValue<string>;
  isDisabled?: boolean;
  type?: HTMLInputTypeAttribute;
}

export function CustomInput({
  placeholder,
  setValue,
  value,
  width,
  isDisabled,
  type,
}: CustomInputProps) {
  return (
    <Input
      backgroundColor='gray.input'
      variant='filled'
      placeholder={placeholder}
      width={width ? width : ['20rem', 'sm']}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      isDisabled={isDisabled ? isDisabled : false}
      type={type ? type : 'text'}
    />
  );
}
