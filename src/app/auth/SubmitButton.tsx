'use client';

import {useFormStatus} from 'react-dom';
import {Button} from '@/components/ui/button';
import type {ButtonProps} from '@/components/ui/button';

type SubmitButtonProps = ButtonProps & {
  idleText: string;
  pendingText: string;
};

export function SubmitButton({idleText, pendingText, disabled, ...props}: SubmitButtonProps) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} aria-disabled={disabled || pending} {...props}>
      {pending ? pendingText : idleText}
    </Button>
  );
}
