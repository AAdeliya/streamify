import { Text, Button, Section } from '@react-email/components';
import * as React from 'react';
import { BaseTemplate } from './base.template';

interface VerificationTemplateProps {
  domain: string;
  token: string;
}

export const VerificationTemplate = ({
  domain,
  token,
}: VerificationTemplateProps) => {
  const verificationUrl = `${domain}/verify?token=${token}`;

  return (
    <BaseTemplate
      title="Verify Your Account"
      domain={domain}
      children={undefined}
    >
      <Text style={text}>
        Please click the button below to verify your email address and activate
        your account.
      </Text>
      <Section style={buttonContainer}>
        <Button pX={20} pY={12} style={button} href={verificationUrl}>
          Verify Email Address
        </Button>
      </Section>
      <Text style={text}>
        If you didn't create an account, you can safely ignore this email.
      </Text>
      <Text style={linkText}>
        Or copy and paste this URL into your browser: <br />
        <a href={verificationUrl} style={link}>
          {verificationUrl}
        </a>
      </Text>
    </BaseTemplate>
  );
};

// Styles
const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#667eea',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

const linkText = {
  color: '#666666',
  fontSize: '14px',
  margin: '16px 0',
};

const link = {
  color: '#667eea',
  textDecoration: 'underline',
};
