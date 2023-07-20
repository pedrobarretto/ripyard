'use client';
import { Input, ResponsiveValue } from '@chakra-ui/react';

interface CustomInputProps {
  placeholder: string;
  value: string | number;
  setValue: (x: any) => void;
  width?: ResponsiveValue<string>;
  isDisabled?: boolean;
}

export function CustomInput({
  placeholder,
  setValue,
  value,
  width,
  isDisabled
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
    />
  );
}
