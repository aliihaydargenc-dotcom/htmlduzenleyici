# V4.5 — Güvenli Gizle odaklı çıktı

Sadece etkin gizleme işlemleri bulunan projelerde, Alan Koruma açık olsa bile çıktı otomatik yerleşim onarımı veya ek JavaScript içermez. Önizleme ve çıktı aynı gizleme CSS’ini kullanır. Orijinal DOM ve scriptler korunur.

Varsayılan **Düzeni koru** seçeneği `visibility:hidden` kullanır: öğe ve alt öğeleri görünmez olur, kapladığı alan kalır. Grafiklerin ölçüleri ve çevredeki yerleşim korunur. **Alanı da kaldır** seçeneği `display:none` kullanır ve doğal olarak yerleşimi değiştirebilir. Önceki manifestlerde gizleme modu yoksa korumalı davranış kullanılır. Gizleme içeriği dosyadan silmez; veri sansürleme aracı değildir.

Etkin taşıma, stil veya diğer işlemler içeren karma projeler mevcut davranışı sürdürür. Önceki çıktıda kaydedilmiş otomatik onarım işlemleri de etkin stil işlemleridir; bu izolasyondan yararlanmak için orijinal kaynak üzerinde yalnız gizleme uygulayın.

`node checks-v4.5.mjs`: 17 kod kontrolü geçti. Gerçek tarayıcı görsel testi ve kullanıcıya ait bozulmuş çıktı karşılaştırması henüz yapılmadı; her HTML için bozulmazlık garantisi verilmez.

# Regnum Evrensel HTML Editörü V4.4

## V4.4 — 5 Eylül 2026

- Ana dosya işlemleri, geçmiş ve panel kontrolleri ayrıldı; yardımcı araçlar **Diğer** menüsünde.
- Daha büyük yazılar, geniş boşluklar, katlanabilir yerleşim ayarları ve ekran genişliğine uyumlu araç çubukları.
- Mobilde açılır paneller, panel kapatma katmanı ve gizli panellere klavye odağının geçmesini engelleme.
- İletişim kutularında odak yönetimi, Tab döngüsü ve metin alanında da çalışan Escape.
- Metin alanlarında Ctrl+Z / Ctrl+Y tarayıcının kendi düzenleme geçmişini kullanır. Editör için Ctrl+Shift+Z yineleme desteği eklendi.
- Alan Koruma kapalı ve işlem listesi boş olduğunda manifestin eksik kalması düzeltildi.
- Depodaki V4.3 taşıma ve yerleşim düzeltmeleri korundu; source.html değiştirilmedi.

### Doğrulama

`node checks-v4.4.mjs` ile 11 kontrol: JavaScript sözdizimi, kaynak ve script bütünlüğü, çalışma zamanı sözdizimi, Unicode manifest, boş işlem çıktısı, CSS yaması, yerel metin geri alma, editör geri/ileri ve güvenli öznitelikler. HTML etiket dengesi, benzersiz kimlikler ve önceki kontrollerin korunması ayrıca doğrulandı.

Tarayıcı önizlemesi bu çalışma ortamının erişim politikası nedeniyle açılamadı. Görsel yerleşim, gerçek tarayıcı sürükle-bırak ve Excel enjeksiyonu bu sürümde uçtan uca doğrulanmadı.

## Kullanım

1. **HTML Aç** ile raporu yükleyin.
2. **Öğeler** panelindeki canlı DOM ağacından hedefi bulun.
3. Taşıma için:
   - **Akış:** genel sayfa sıralaması ve kapsayıcı içine yerleştirme.
   - **Grid:** grid/flex hücreleri arasında taşıma.
   - **Serbest:** piksel bazlı kaydırma; olası alan/çakışma riski engellenmez, kontrol raporuna uyarı olarak eklenir.
4. Akış veya Grid modunda mavi hedef alanlarını, yeşil aktif alanı, gerçek yer tutucuyu ve “önce / içine / sonra” etiketini görmeden bırakmayın.
5. Gerekirse **Güvenli öznitelikler** bölümünden `title`, `role`, `aria-*` veya `data-*` yaması ekleyin.
6. **Nihai Kontrol** ile sekiz zorunlu kontrolü çalıştırın.
7. Kritik kontroller geçince **Nihai HTML İndir** ile sonucu alın.

## V4.3’te eklenenler

- Katlanabilir, aranabilir ve yenilenebilir canlı DOM ağacı
- Ağaçtan seçme, hedefi görünür kılma ve üzerine gelince vurgulama
- Akış / Grid / Serbest taşıma modları
- Geçerli kapsayıcı vurgusu, gerçek yer tutucu ve kesin bırakma etiketi
- Kenara yaklaşınca otomatik kaydırma ve `Esc` ile sürüklemeyi iptal
- Serbest taşımada katı engel yerine kayıtlı risk uyarısı
- Kaynak içinde sıradaki eşleşmeyi bulma
- Güvenli öznitelik ekleme/kaldırma yamaları
- Değişiklik listesinden işlem hedefini yeniden bulma
- Evrensel ve Regnum otel raporu test verisi şablonları
- İşlem konsolunu tek tıkla kopyalama
- Kaynak, script, manifest, seçici, çalışma zamanı ve yerleşim kontrolleri

## Kapsam ve güvenlik

- Editör kaynak HTML’in mevcut scriptlerini yeniden yazmaz.
- CSS düzenlemeleri tek bir yama bloğuna; metin, öznitelik ve taşıma işlemleri tek bir çalışma zamanı bloğuna eklenir.
- Yamalar çıktıdan çıkarıldığında giriş kaynağının karakter karakter aynı olduğu doğrulanır.
- `id`, `class`, `style`, bağlantı, kaynak ve olay (`on*`) öznitelikleri; CSS/JavaScript bağımlılıklarını sessizce bozmamak için öznitelik aracında kilitlidir.
- Tarayıcı güvenliği nedeniyle bilgisayardaki göreli dosyalar kendiliğinden okunamaz. Bu dosyaları GitHub deposuna aynı klasör yapısıyla koyun.
- Yalnızca güvendiğiniz HTML dosyalarını editörde çalıştırın.
