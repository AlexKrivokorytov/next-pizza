import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Img
} from '@react-email/components';
import * as React from 'react';

interface OrderReceiptEmailProps {
  orderId: number;
  fullName: string;
  totalAmount: number;
  address: string;
  items: any[];
}

export const OrderReceiptEmail = ({
  orderId = 1,
  fullName = 'John Doe',
  totalAmount = 0,
  address = '123 Main St',
  items = [],
}: OrderReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Next Pizza Order Receipt</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Receipt for Order #{orderId}</Heading>
          
          <Text style={text}>
            Hi {fullName},
          </Text>
          <Text style={text}>
            Thanks for ordering from Next Pizza! We've received your payment and are now preparing your delicious food.
          </Text>

          <Section style={receiptSection}>
            <Heading as="h2" style={h2}>Order Summary</Heading>
            
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={{ width: '64px', paddingRight: '16px' }}>
                  <Img 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop'} 
                    width="64" 
                    height="64" 
                    style={{ borderRadius: '8px' }}
                    alt={item.name} 
                  />
                </Column>
                <Column>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemDetails}>Qty: {item.quantity}</Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            <Row>
              <Column>
                <Text style={totalText}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalPrice}>${totalAmount.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={deliverySection}>
            <Heading as="h3" style={h3}>Delivery Address</Heading>
            <Text style={text}>{address}</Text>
          </Section>

          <Text style={footer}>
            Next Pizza Inc. • Fresh and Hot Delivery
          </Text>
        </Container>
      </Body>
    </Html>
  );
};


const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '0 0 20px 0',
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  margin: '0 0 16px 0',
};

const h3 = {
  color: '#333',
  fontSize: '16px',
  margin: '0 0 8px 0',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const receiptSection = {
  backgroundColor: '#f9f9f9',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
};

const deliverySection = {
  padding: '24px',
  border: '1px solid #e6e6e6',
  borderRadius: '8px',
};

const itemRow = {
  marginBottom: '16px',
};

const itemName = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0',
};

const itemDetails = {
  fontSize: '14px',
  color: '#777',
  margin: '4px 0 0 0',
};

const itemPrice = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '16px 0',
};

const totalText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0',
};

const totalPrice = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '32px 0 0 0',
  textAlign: 'center' as const,
};
