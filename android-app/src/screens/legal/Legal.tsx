/**
 * Legal — سياسة الخصوصية وشروط الاستخدام.
 * نصوص قانونية عربية كاملة قابلة للتبديل عبر Chips.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, sp, typ } from '../../design';
import { Shell, Card, Chip } from '../../ui';

const SECTIONS: { key: string; title: string; body: string[] }[] = [
  {
    key: 'privacy',
    title: 'سياسة الخصوصية',
    body: [
      'آخر تحديث: أغسطس 2026. تحترم منصة JobEzz خصوصية مستخدميها وتلتزم بحماية البيانات الشخصية الواردة في هذه السياسة.',
      'جمع البيانات: نجمع فقط البيانات اللازمة لتقديم الخدمة، مثل الاسم ورقم الهاتف والموقع (المدينة) وبيانات الدفع عبر مزوّدي الدفع المعتمدين.',
      'استخدام البيانات: تُستخدم بياناتك لتحسين التجربة، ومطابقة الطلبات مع الفنيين، وإصدار الفواتير، وإرسال الإشعارات التي طلبتها.',
      'المشاركة: لا نبيع بياناتك لأي طرف ثالث، ونشارك الحد الأدنى الضروري فقط مع الفني والجهات المنظمة عند الاقتضاء.',
      'التواصل: لأي استفسار حول هذه السياسة تواصل معنا عبر privacy@jobezz.example، وسنرد خلال 30 يوماً.',
    ],
  },
  {
    key: 'terms',
    title: 'شروط الاستخدام',
    body: [
      'آخر تحديث: أغسطس 2026. باستخدامك منصة JobEzz فأنت توافق على هذه الشروط وعلى سياسة الخصوصية المنشورة.',
      'الاستخدام المسموح: تُستخدم المنصة للطلب والحجز والتواصل بين العملاء ومقدّمي الخدمات وفق الأنظمة السارية.',
      'الدفع والعمولة: تُخصم عمولة المنصة من المستلم كما هو موضح في الفاتورة، ولا تُسترد الرسوم بعد بدء الخدمة إلا وفق ما ينص عليه النظام.',
      'المسؤولية: المنصة وسيط تقني بين الطرفين، ولا تتحمل مسؤولية جودة العمل المنفذ بينهما، مع التزامها بحماية بيانات الطرفين.',
      'قواعد السلوك: يمنع طلب الدفع خارج المنصة أو استعمال بيانات المستخدمين لأغراض غير مصرح بها، ويُحظر كل مخالف بموجب القوانين المعمول بها.',
    ],
  },
];

export function Legal({ navigation, route }: any) {
  const section = route.params?.section || 'privacy';
  const active = SECTIONS.find((s) => s.key === section) || SECTIONS[0];

  return (
    <Shell title="السياسة والشروط" navigation={navigation} back>
      <View style={styles.chips}>
        {SECTIONS.map((sec) => (
          <Chip
            key={sec.key}
            label={sec.title}
            active={active.key === sec.key}
            onPress={() => navigation.setParams({ section: sec.key })}
          />
        ))}
      </View>
      <Card contentStyle={styles.card}>
        <Text style={styles.title}>{active.title}</Text>
        {active.body.map((p, i) => (
          <Text key={i} style={styles.para}>{p}</Text>
        ))}
      </Card>
      <Text style={styles.footer}>JobEzz © 2026 · جميع الحقوق محفوظة</Text>
    </Shell>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.sm, marginBottom: sp.base },
  card: { gap: sp.md },
  title: { ...typ.h3, color: palette.textHi },
  para: { ...typ.bodyS, color: palette.textMid, lineHeight: 23 },
  footer: { ...typ.caption, color: palette.textLow, textAlign: 'center', marginTop: sp.lg },
});
