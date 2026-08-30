import re

with open('src/components/ProfileSetup.tsx', 'r') as f:
    content = f.read()

coupon_check = """    // Check if free 7-day coupon was provided
    const cleanCoupon = regCoupon.trim().toUpperCase();
    const isFree7dCouponMatch = ['VIP7', 'GRATIS7', 'VIP', 'TESTEVIP', 'CURA7', '7DIAS', 'SETE7', 'PICENI7'].includes(cleanCoupon);
    
    let isFree7dCoupon = false;
    if (isFree7dCouponMatch) {
      const vipCount = accounts.filter(acc => acc.subscriptionPlan === 'teste_vip_7d').length;
      if (vipCount >= 10) {
        setError('O limite de 10 vagas para o cupom VIP7 já foi preenchido. Você ainda pode usar o app gratuitamente no Dia 1, ou assinar o plano PRO para desbloquear a jornada completa.');
        return;
      }
      isFree7dCoupon = true;
    }"""

content = re.sub(
    r"// Check if free 7-day coupon was provided.*?const isFree7dCoupon = \['VIP7', 'GRATIS7', 'VIP', 'TESTEVIP', 'CURA7', '7DIAS', 'SETE7', 'PICENI7'\].includes\(cleanCoupon\);",
    coupon_check,
    content,
    flags=re.DOTALL
)

with open('src/components/ProfileSetup.tsx', 'w') as f:
    f.write(content)
