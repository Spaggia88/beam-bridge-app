import React from 'react';
import { styled } from '@linaria/react';

interface CardProps {
  balanceValue?: number,
  type?: 'eth' | 'usdt'
}
const CardStyled = styled.div<CardProps>`
  width: calc((100% - 10px) / 2);
  height: 75px;
  margin-top: 10px
  padding: 20px;
  border-radius: 10px;
  background-image: linear-gradient(99deg, 
    ${({ type }) => `var(--color-${type}-from)`} 2%, rgb(0, 69, 143, .3) 99%);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LogoStyled = styled.object`
  display: block;
`;

const BalanceStyled = styled.p`
  font-size: 16px;
  margin-left: 10px;
`;

const Card: React.FC<CardProps> = ({
  children,
  balanceValue,
  type,
  ...rest
}) => {

const data = './assets/icon-balance-' + type + '.svg';
const currency = type.toUpperCase();
return (<CardStyled type={type} {...rest}>
    <LogoStyled
      type="image/svg+xml"
      data={data}
      width="26"
      height="26"
    ></LogoStyled>
    <BalanceStyled>{balanceValue} {currency}</BalanceStyled>
  </CardStyled>
)};

export default Card;
