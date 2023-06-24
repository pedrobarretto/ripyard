'use client';
import { Input, ResponsiveValue, ThemingProps } from '@chakra-ui/react';

interface CustomInputProps {
  placeholder: string;
  value: string | number;
  setValue: (x: any) => void;
  width?: ResponsiveValue<string>;
}

export function CustomInput({
  placeholder,
  setValue,
  value,
  width,
}: CustomInputProps) {
  return (
    <Input
      backgroundColor='gray.input'
      variant='filled'
      placeholder={placeholder}
      width={width ? width : 'sm'}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
