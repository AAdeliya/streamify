import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface BaseTemplateProps {
  title: string;
  children: React.ReactNode;
  domain?: string;
}

export const BaseTemplate = ({
  title,
  children,
  domain,
}: BaseTemplateProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={headerText}>Your App</Text>
        </Section>
        <Section style={content}>
          <Text style={title}>{title}</Text>
          {children}
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>© 2025 Your App. All rights reserved.</Text>
          {domain && (
            <Text style={footerText}>
              <a href={domain} style={link}>
                Visit our website
              </a>
            </Text>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 24px',
  backgroundColor: '#667eea',
};

const headerText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
};

const content = {
  padding: '0 24px',
};

const title = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#333333',
  margin: '24px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '0 24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  margin: '4px 0',
};

const link = {
  color: '#667eea',
  textDecoration: 'underline',
};
