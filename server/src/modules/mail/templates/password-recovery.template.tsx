import { Text, Button, Section } from '@react-email/components';
import * as React from 'react';
import { BaseTemplate } from './base.template';
import { SessionMetadata } from '../../../shared/types/session-metadata.types';

interface PasswordRecoveryTemplateProps {
  domain: string;
  token: string;
  metadata: SessionMetadata;
}

export const PasswordRecoveryTemplate = ({
  domain,
  token,
  metadata,
}: PasswordRecoveryTemplateProps) => {
  const resetUrl = `${domain}/reset-password?token=${token}`;

  return (
    <BaseTemplate
      title="Reset Your Password"
      domain={domain}
      children={undefined}
    >
      <Text style={text}>
        We received a request to reset your password. If you made this request,
        click the button below to reset your password.
      </Text>
      <Section style={buttonContainer}>
        <Button pX={20} pY={12} style={button} href={resetUrl}>
          Reset Password
        </Button>
      </Section>
      <Text style={text}>
        If you didn't request a password reset, you can safely ignore this
        email.
      </Text>

      <Section style={metadataSection}>
        <Text style={metadataTitle}>Request Details:</Text>
        <Text style={metadataText}>
          <strong>Location:</strong> {metadata.city}, {metadata.country}
          <br />
          <strong>IP Address:</strong> {metadata.ip}
          <br />
          <strong>Browser:</strong> {metadata.browser}
          <br />
          <strong>Operating System:</strong> {metadata.os}
          <br />
          <strong>Time:</strong> {metadata.timestamp.toLocaleString()}
        </Text>
      </Section>

      <Text style={linkText}>
        Or copy and paste this URL into your browser: <br />
        <a href={resetUrl} style={link}>
          {resetUrl}
        </a>
      </Text>
    </BaseTemplate>
  );
};

// Styles (same as verification template plus metadata styles)
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

const metadataSection = {
  backgroundColor: '#f8f9fa',
  padding: '16px',
  borderRadius: '5px',
  margin: '24px 0',
};

const metadataTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#333333',
  margin: '0 0 8px 0',
};

const metadataText = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '20px',
  margin: '0',
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
