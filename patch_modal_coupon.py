import re

with open('src/components/ProUpgradeModal.tsx', 'r') as f:
    content = f.read()

coupon_logic = """    const free7dCoupons = ['VIP7', 'GRATIS7', 'VIP', 'TESTEVIP', 'CURA7', '7DIAS', 'SETE7', 'PICENI7', 'DEGUSTACAO', 'DEGUSTA7'];
    if (free7dCoupons.includes(rawCode)) {
      // Check VIP7 usage limit
      const saved = localStorage.getItem('cura_integrada_accounts_v1');
      let accounts = [];
      if (saved) {
        try { accounts = JSON.parse(saved); } catch (e) {}
      }
      const vipCount = accounts.filter(acc => acc.subscriptionPlan === 'teste_vip_7d').length;
      if (vipCount >= 10) {
        setCouponFeedback({ type: 'error', message: 'O limite de 10 vagas para o cupom VIP7 (100% Grátis) já foi preenchido. Aproveite os demais cupons de desconto!' });
        return;
      }
      
      setSelectedPlanId('teste_vip_7d');
      setDiscountPercent(100);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: `✨ Cupom ${rawCode} Ativado! Degustação de 7 Dias 100% Gratuita liberada!` });
    } else if (rawCode === 'DESCONTO10'"""

content = re.sub(
    r"    const free7dCoupons = \['VIP7', 'GRATIS7', 'VIP', 'TESTEVIP', 'CURA7', '7DIAS', 'SETE7', 'PICENI7', 'DEGUSTACAO', 'DEGUSTA7'\];\n    if \(free7dCoupons\.includes\(rawCode\)\) \{\n      setSelectedPlanId\('teste_vip_7d'\);\n      setDiscountPercent\(100\);\n      setAppliedCoupon\(rawCode\);\n      setCouponFeedback\(\{ type: 'success', message: `✨ Cupom \$\{rawCode\} Ativado! Degustação de 7 Dias 100% Gratuita liberada!` \}\);\n    \} else if \(rawCode === 'DESCONTO10'",
    coupon_logic,
    content
)

with open('src/components/ProUpgradeModal.tsx', 'w') as f:
    f.write(content)
