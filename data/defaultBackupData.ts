
import type { Topic } from '../types';

interface DefaultBackupData {
  appDataVersion: number;
  appTopics: Topic[];
  appTitle: string;
}

export const defaultBackupData: DefaultBackupData = {
  "appDataVersion": 24,
  "appTopics": [
    {
      "id": "turkiye-cumhuriyet-anayasasi-0",
      "name": "Türkiye Cumhuriyet Anayasası",
      "iconName": "History",
      "color": "bg-orange-500/20",
      "bgColor": "bg-orange-900/40",
      "questions": [
        {
          "id": 1,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisi Türkiye Cumhuriyeti'nin değiştirilemez niteliklerinden biri değildir?",
          "options": [
            "Demokratik devlet",
            "Laik devlet",
            "Sosyalist devlet",
            "Hukuk devleti"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 2,
          "questionText": "1982 Anayasası'na göre, kanun teklif etmeye kimler yetkilidir?",
          "options": [
            "Bakanlar",
            "Milletvekilleri",
            "Cumhurbaşkanı yardımcıları",
            "TBMM Başkanı"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 3,
          "questionText": "Türkiye Büyük Millet Meclisi (TBMM) bir yasama yılında en çok ne kadar süre tatil yapabilir?",
          "options": [
            "1 ay",
            "2 ay",
            "3 ay",
            "4 ay"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 4,
          "questionText": "1982 Anayasası'na göre, Cumhurbaşkanı aşağıdakilerden hangisini seçemez veya atayamaz?",
          "options": [
            "Bakanları",
            "Anayasa Mahkemesi üyelerini",
            "Yargıtay Cumhuriyet Başsavcısını",
            "TBMM Başkanını"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 5,
          "questionText": "Anayasa Mahkemesi üyelerinin görev süresi kaç yıldır ve tekrar seçilebilirler mi?",
          "options": [
            "8 yıldır, tekrar seçilebilirler",
            "10 yıldır, tekrar seçilemezler",
            "12 yıldır, tekrar seçilemezler",
            "Süresizdir, yaş haddine kadar görev yaparlar"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 6,
          "questionText": "Aşağıdakilerden hangisi temel hak ve hürriyetlerin sınırlandırılma sebeplerinden biri olamaz?",
          "options": [
            "Genel sağlık",
            "Kamu düzeni",
            "Milli güvenlik",
            "Ekonomik kriz"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 7,
          "questionText": "1982 Anayasası'na göre, TBMM'nin toplantı yeter sayısı üye tamsayısının en az ne kadarıdır?",
          "options": [
            "Dörtte biri",
            "Beşte biri",
            "Üçte biri",
            "Salt çoğunluk"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 8,
          "questionText": "Cumhurbaşkanı'nın hastalık ve yurt dışına çıkma gibi sebeplerle geçici olarak görevinden ayrılması hâllerinde, görevine dönünceye kadar Cumhurbaşkanlığına kim vekâlet eder?",
          "options": [
            "TBMM Başkanı",
            "En yaşlı Cumhurbaşkanı yardımcısı",
            "Cumhurbaşkanı yardımcısı",
            "Anayasa Mahkemesi Başkanı"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 9,
          "questionText": "Aşağıdakilerden hangisi Anayasa'da sayılan Yüksek Mahkemeler arasında yer almaz?",
          "options": [
            "Anayasa Mahkemesi",
            "Yargıtay",
            "Danıştay",
            "Sayıştay"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 10,
          "questionText": "Bir siyasi partinin Anayasa Mahkemesince temelli kapatılmasına sebep olan fiillerin işlendiği tarihten itibaren kaç yıl geçmedikçe aynı adla başka bir parti kurulamaz?",
          "options": [
            "3 yıl",
            "5 yıl",
            "7 yıl",
            "10 yıl"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 11,
          "questionText": "1982 Anayasası'na göre, usulüne göre yürürlüğe konulmuş milletlerarası antlaşmalar hakkında aşağıdakilerden hangisi doğrudur?",
          "options": [
            "Kanun hükmündedirler",
            "Anayasa'ya aykırılığı iddia edilemez",
            "Yönetmeliklerden üstündürler",
            "Hepsi doğru"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 12,
          "questionText": "TBMM, üye tamsayısının en az kaçının oyuyla seçimlerin yenilenmesine karar verebilir?",
          "options": [
            "Salt çoğunluğu",
            "Dörtte üç çoğunluğu",
            "Beşte üç çoğunluğu",
            "Üçte iki çoğunluğu"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 13,
          "questionText": "Olağanüstü hal (OHAL) ilan etme yetkisi kime aittir ve süresi en fazla ne kadardır?",
          "options": [
            "TBMM / 4 ay",
            "Cumhurbaşkanı / 6 ay",
            "Bakanlar Kurulu / 3 ay",
            "Milli Güvenlik Kurulu / 1 yıl"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 14,
          "questionText": "Anayasa'nın değiştirilmesi teklifi, TBMM üye tamsayısının en az ne kadarı tarafından yazılı olarak yapılabilir?",
          "options": [
            "Dörtte biri",
            "Üçte biri",
            "Beşte biri",
            "Salt çoğunluk"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 15,
          "questionText": "1982 Anayasası'na göre aşağıdakilerden hangisi, hem hak hem de ödev olarak düzenlenmiştir?",
          "options": [
            "Seçme ve seçilme hakkı",
            "Mülkiyet hakkı",
            "Vatan hizmeti",
            "Dilekçe hakkı"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 16,
          "questionText": "Yüksek Seçim Kurulu (YSK) kaç asıl ve kaç yedek üyeden oluşur?",
          "options": [
            "7 asıl, 4 yedek",
            "9 asıl, 3 yedek",
            "11 asıl, 4 yedek",
            "5 asıl, 2 yedek"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 17,
          "questionText": "TBMM tarafından kabul edilen kanunları Cumhurbaşkanı, yayımlanması için kaç gün içinde Resmi Gazete'ye gönderir?",
          "options": [
            "7 gün",
            "10 gün",
            "15 gün",
            "30 gün"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 18,
          "questionText": "Aşağıdakilerden hangisi \"sosyal ve ekonomik haklar ve ödevler\" bölümünde yer almaz?",
          "options": [
            "Sendika kurma hakkı",
            "Konut hakkı",
            "Çalışma ve sözleşme hürriyeti",
            "Dilekçe hakkı"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 19,
          "questionText": "Danıştay üyelerinin dörtte üçünü kim seçer?",
          "options": [
            "Cumhurbaşkanı",
            "TBMM",
            "Adalet Bakanı",
            "Hâkimler ve Savcılar Kurulu (HSK)"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 20,
          "questionText": "Bir milletvekilinin, meclis çalışmalarına özürsüz veya izinsiz olarak bir ay içinde toplam kaç birleşim günü katılmaması halinde milletvekilliği düşer?",
          "options": [
            "3 birleşim günü",
            "5 birleşim günü",
            "7 birleşim günü",
            "10 birleşim günü"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 21,
          "questionText": "1982 Anayasası'na göre \"Egemenlik kayıtsız şartsız\" kime aittir?",
          "options": [
            "Devlet'e",
            "TBMM'ye",
            "Cumhurbaşkanı'na",
            "Millet'e"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 22,
          "questionText": "Cumhurbaşkanlığı kararnameleri ile aşağıdakilerden hangisi düzenlenemez?",
          "options": [
            "Bakanlıkların kurulması",
            "Üst kademe kamu yöneticilerinin atanması",
            "Temel haklar, kişi hakları ve ödevleri",
            "Milli güvenlik politikaları"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 23,
          "questionText": "Meclis Soruşturması açılması, TBMM üye tamsayısının en az ne kadarının önergesiyle istenebilir?",
          "options": [
            "Beş-te biri",
            "Dörtte biri",
            "Üçte biri",
            "Salt çoğunluğu"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 24,
          "questionText": "Kamu başdenetçisini (Ombudsman) kim seçer?",
          "options": [
            "Cumhurbaşkanı",
            "TBMM",
            "Danıştay",
            "Hâkimler ve Savcılar Kurulu"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 25,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisi yerel yönetim birimi değildir?",
          "options": [
            "İl özel idaresi",
            "Belediye",
            "Köy",
            "Bucak"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 26,
          "questionText": "Bir kanunun Anayasa'ya şekil bakımından aykırılığı iddiasıyla Anayasa Mahkemesi'nde iptal davası açma süresi, kanunun yayımlanmasından itibaren kaç gündür?",
          "options": [
            "10 gün",
            "15 gün",
            "30 gün",
            "60 gün"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 27,
          "questionText": "Devlet Denetleme Kurulu (DDK) hangi makama bağlı olarak çalışır?",
          "options": [
            "TBMM Başkanlığı",
            "Cumhurbaşkanlığı",
            "Danıştay",
            "Sayıştay"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 28,
          "questionText": "1982 Anayasası'na göre, grev hakkı ile ilgili aşağıdaki ifadelerden hangisi yanlıştır?",
          "options": [
            "Toplu iş sözleşmesi yapılması sırasında uyuşmazlık çıkması halinde işçiler grev hakkına sahiptir",
            "Siyasi amaçlı grevler yasaktır",
            "Grev hakkı iyi niyet kurallarına aykırı şekilde kullanılamaz",
            "Memurların da grev hakkı vardır"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 29,
          "questionText": "Aşağıdakilerden hangisi Cumhurbaşkanının görev ve yetkilerinden biri değildir?",
          "options": [
            "Kanunları yayımlamak",
            "Milletlerarası andlaşmaları onaylamak ve yayımlamak",
            "Genel af ilan etmek",
            "Milli Güvenlik Kuruluna başkanlık etmek"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 30,
          "questionText": "Anayasanın değiştirilmesi hakkındaki kanunların kabulü için gerekli olan en az oy oranı nedir?",
          "options": [
            "Üye tamsayısının salt çoğunluğu",
            "Üye tamsayısının üçte ikisi",
            "Üye tamsayısının beşte üçü",
            "Toplantıya katılanların salt çoğunluğu"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 31,
          "questionText": "1982 Anayasası'ndaki \"Hiçbir kimse veya organ kaynağını anayasadan almayan bir devlet yetkisi kullanamaz.\" hükmü, aşağıdakilerden hangisi ile ilgilidir?",
          "options": [
            "Yasama yetkisi",
            "Kanun önünde eşitlik",
            "Egemenlik",
            "Devletin büyüklüğü",
            "Devlet şekli"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 32,
          "questionText": "Cumhuriyete ilişkin aşağıdaki ifadelerden hangisi yanlıştır?",
          "options": [
            "Hem bir devlet şekli hem de bir hükümet şeklidir.",
            "Egemenliğin toplumun tümüne ait olduğu devleti ifade eder.",
            "Veraset ilkesinin rol oynamadığı bir hükümet sistemini anlatır.",
            "Devletin temel organlarının seçimle iş başına geldiği bir yönetim biçimidir.",
            "Türk inkılabının ortaya çıkardığı cumhuriyetçilik anlayışı sadece hükümdarlığın reddi anlamını taşır."
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 33,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın değiştirilmesi teklif dahi edilemeyen hükümleri arasında yer alır?",
          "options": [
            "Türkiye devleti bir cumhuriyettir.",
            "18 yaşını dolduran her Türk vatandaşı seçme hakkına sahiptir.",
            "Cumhurbaşkanının görev süresi 5 yıldır.",
            "18 yaşını dolduran her Türk, milletvekili seçilebilir.",
            "Cumhurbaşkanı halk tarafından seçilir."
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 34,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisi cumhuriyetin niteliklerinden biri değildir?",
          "options": [
            "Laik devlet",
            "Sosyal devlet",
            "Hukuk devleti",
            "Teokratik devlet",
            "Demokratik devlet"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 35,
          "questionText": "\"Türkiye Cumhuriyeti, toplumun huzuru, milli dayanışma ve adalet anlayışı içinde, insan haklarına saygılı, Atatürk milliyetçiliğine bağlı, başlangıçta belirtilen temel ilkelere dayanan, laik ve sosyal bir hukuk devletidir.\" 1982 Anayasası'nın yukarıdaki bu hükmü, aşağıdakilerden hangisini vurgulamaktadır?",
          "options": [
            "Devletin temel amaç ve görevlerini",
            "Anayasanın bağlayıcılığını ve üstünlüğünü",
            "Egemenliği",
            "Devlet bağımsızlığını",
            "Cumhuriyetin niteliklerini"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 36,
          "questionText": "1982 Anayasası'na göre egemenlik aşağıdakilerden hangisine aittir?",
          "options": [
            "Millet'e",
            "Devlet'e",
            "Yargı'ya",
            "Cumhurbaşkanı'na",
            "Ordu'ya"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 37,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisi devletin amaç ve görevlerinden biri değildir?",
          "options": [
            "Cumhuriyeti korumak",
            "Demokrasiyi korumak",
            "Yasama faaliyetlerini denetlemek",
            "Türk milletinin bütünlüğünü korumak",
            "Kişilerin ve toplumun refah, huzur ve mutluluğunu sağlamak"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 38,
          "questionText": "Aşağıdakilerden hangisi doğrudan 1982 Anayasası'nda düzenlenmemiştir?",
          "options": [
            "Ülkenin sınırları",
            "Başkentin Ankara olması",
            "Milli marşın İstiklâl Marşı olması",
            "Bayrağın ay yıldızlı al bayrak olması",
            "Türkiye Devleti'nin ülkesi ve milletiyle bölünmez bir bütün olması"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 39,
          "questionText": "1982 Anayasası'na göre temel hak ve özgürlüklerin kullanılması kısmen veya tamamen durdurulabilir. Buna göre; I. Seferberlik II. Tatbikat III. Olağanüstü hâl IV. Savaş hangisi temel hak ve özgürlüklerin kısmen ya da tamamen durdurulabileceği durumlardan biri değildir?",
          "options": [
            "Yalnız I",
            "Yalnız II",
            "II ve III",
            "III ve IV",
            "I, II, III ve IV"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 40,
          "questionText": "1982 Anayasası'nda hiçbir şekilde durdurulamayacak temel hak ve özgürlüklerden biri sayılmamıştır?",
          "options": [
            "Yasama hakkı",
            "Mülkiyet hakkı",
            "Suçluluğu mahkeme kararıyla ispatlanıncaya kadar kimsenin suçlu sayılamayacağı",
            "Kimsenin din, vicdan, düşünce ve kanaatlerini açıklamaya zorlanamaması",
            "Suç ve cezaların geçmişe yürümemesi"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 41,
          "questionText": "1982 Anayasası'na göre, mülkiyet hakkı aşağıdaki temel hak ve özgürlüklerden hangisi içinde düzenlenmiştir?",
          "options": [
            "Aktif statü hakları",
            "Dayanaşma hakları",
            "Sosyal ve ekonomik haklar ve ödevler",
            "Kolektif haklar",
            "Pozitif statü hakları"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 42,
          "questionText": "Aşağıdaki sosyal haklardan hangileri devletin mali gücüne bağlı olamaz?",
          "options": [
            "Sendika hakkı",
            "Sağlık hizmetlerinden faydalanma hakkı",
            "Eğitim hizmetlerinden faydalanma hakkı",
            "Sosyal güvenlik",
            "Konut hakkı"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 43,
          "questionText": "Aşağıdakilerden hangisi hakkında Cumhurbaşkanlığı kararnamesiyle düzenleme yapılabilir?",
          "options": [
            "Kişi hakları ve ödevleri",
            "Temel haklar",
            "Sosyal ve ekonomik haklar ve ödevler",
            "Kanunla açıkça düzenlenen konular",
            "Siyasi haklar ve ödevler"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 44,
          "questionText": "Kişileri, devlete ve topluma karşı koruyan hak ve özgürlüklere \"koruyucu hak\" denir. Aşağıdakilerden hangisi koruyucu haklar arasında yer alır?",
          "options": [
            "Seçme ve seçilme hakkı",
            "Eğitim ve öğrenim hakkı",
            "Kamu yararı",
            "Sosyal güvenlik hakkı",
            "Mülkiyet hakkı"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 45,
          "questionText": "1982 Anayasası'nın temel hak ve özgürlüklere ilişkin maddelerinin yazımında özellikle hangi uluslararası sözleşme ile bir uyum ve paralellik sağlanması için çaba gösterilmiştir?",
          "options": [
            "Avrupa İnsan Hakları Sözleşmesi",
            "Çocuk Hakları Sözleşmesi",
            "Roma Sözleşmesi",
            "Kyoto Sözleşmesi",
            "Soykırım Suçunun Önlenmesi Sözleşmesi"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 46,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nda hiçbir şekilde durdurulamayacak temel hak ve özgürlüklerden biri sayılmamıştır?",
          "options": [
            "Yasama hakkı",
            "Mülkiyet hakkı",
            "Sendika kurma hakkı",
            "Kimsenin din, vicdan, düşünce ve kanaatlerini açıklamaya zorlanamaması",
            "Suç ve cezaların geçmişe yürümemesi"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 47,
          "questionText": "1982 Anayasası'nın metnine dahil değildir?",
          "options": [
            "Başlangıç kısmı",
            "Geçici maddeler",
            "Anayasa değişikliğine ilişkin hüküm",
            "İnkılâp Kanunları'nın korunmasına ilişkin madde",
            "Madde kenar başlıkları"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 48,
          "questionText": "Atatürk milliyetçiliği hangi milliyetçilik anlayışını benimsemektedir?",
          "options": [
            "Objektif milliyetçilik",
            "Subjektif milliyetçilik",
            "Coğrafi milliyetçilik",
            "Dini milliyetçilik",
            "Etnik milliyetçilik"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 49,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın değiştirilemez ve değiştirilmesi teklif dahi edilemez maddelerinden biri değildir?",
          "options": [
            "Türkiye Devleti bir cumhuriyettir.",
            "Türkiye Devleti, ülkesi ve milletiyle bölünmez bir bütündür.",
            "Türkiye Devleti'nin bayrağı, şekli kanunda belirtilen beyaz ay yıldızlı al bayraktır.",
            "Türkiye Cumhuriyeti, demokratik, laik ve sosyal hukuk devletidir.",
            "Yürütme yetkisi ve görevi, Cumhurbaşkanı tarafından kullanılır ve yerine getirilir."
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 50,
          "questionText": "1982 Anayasası'na göre aşağıdakilerden hangisi devletin temel amaç ve görevleri arasında yer almaz?",
          "options": [
            "Kişinin temel hak ve hürriyetlerini sosyal hukuk devleti ve adalet ilkeleriyle bağdaşmayacak biçimde sınırlayan engelleri kaldırmaya çalışmak",
            "Türk milletinin bağımsızlığını ve bütünlüğünü korumak",
            "Seçilmişlerin üstünlüğünü sağlamak",
            "Cumhuriyeti ve demokrasiyi korumak",
            "Kişilerin ve toplumun refah, huzur ve mutluluğunu sağlamak"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 51,
          "questionText": "Aşağıdakilerden hangisi cumhuriyetin nitelikleri arasında yer alan demokratik devlet ilkesinin belirleyici özelliklerinden değildir?",
          "options": [
            "Temel siyasi karar organlarında görev alacakların halk tarafından seçilmesi",
            "Seçimlerin yargısal denetiminin bağımsız ve tarafsız yargı organlarınca yapılması",
            "Çok partili siyasi hayatın varlığı",
            "İdarenin faaliyetlerinin önceden bilinebilir olması",
            "Seçimlerin düzenli aralıklarla tekrarlanması"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 52,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın genel özellikleri arasında yer almaz?",
          "options": [
            "Türk anayasa tarihinin en sert ve en kazuistik anayasasıdır.",
            "Daha az katılımcı bir demokrasi modelini benimsemiştir.",
            "Halk oylaması sonucunda kabul edilmiştir.",
            "Kurucu Meclis tarafından hazırlanmıştır.",
            "Güçler birliği, görevler ayrılığı ilkesini benimsemiştir."
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 53,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın metnine dâhil değildir?",
          "options": [
            "Anayasanın yürürlüğe girmesine ilişkin 177. madde",
            "İnkılap Kanunları'nın korunmasına ilişkin 174. madde",
            "Anayasanın geçici maddeleri",
            "Anayasada bulunan madde ve kenar başlıkları",
            "Anayasanın başlangıç kısmı"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 54,
          "questionText": "1982 Anayasası'na göre temel hak ve özgürlüklerin kullanılması kısmen veya tamamen durdurulabilir. Buna göre; I. Seferberlik II. Tatbikat III. Olağanüstü hâl IV. Savaş hangisi temel hak ve özgürlüklerin kısmen ya da tamamen durdurulabileceği durumlardan biri değildir?",
          "options": [
            "Yalnız I",
            "Yalnız II",
            "II ve III",
            "III ve IV",
            "I, II, III ve IV"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 55,
          "questionText": "Eğitim ve öğrenim hakkı ve ödevi 1982 Anayasası’nın hangi bölümünde düzenlenmiştir?",
          "options": [
            "Siyasi haklar ve ödevler",
            "Temel hak ve ödevler",
            "Kişinin hakları ve ödevleri",
            "Genel hükümler",
            "Sosyal ve ekonomik haklar ve ödevler"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 56,
          "questionText": "Bir ülkede insanların haklarını ilgili kurumlara başvurarak arayabilmeleri için sahip olmaları gereken hak öncelikle aşağıdakilerden hangisidir?",
          "options": [
            "Seçme hakkı",
            "Dilekçe hakkı",
            "Yerleşme hakkı",
            "Özel yaşamın gizliliği",
            "Konut dokunulmazlığı hakkı"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 57,
          "questionText": "Aşağıdaki sosyal haklardan hangileri devletin mali gücüne bağlı olamaz?",
          "options": [
            "Sendika hakkı",
            "Sağlık hizmetlerinden faydalanma hakkı",
            "Eğitim hizmetlerinden faydalanma hakkı",
            "Sosyal güvenlik",
            "Konut hakkı"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 58,
          "questionText": "Aşağıdakilerden hangisi hakkında Cumhurbaşkanlığı kararnamesiyle düzenleme yapılabilir?",
          "options": [
            "Kişi hakları ve ödevleri",
            "Temel haklar",
            "Sosyal ve ekonomik haklar ve ödevler",
            "Kanunla açıkça düzenlenen konular",
            "Siyasi haklar ve ödevler"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 59,
          "questionText": "Kişileri, devlete ve topluma karşı koruyan hak ve özgürlüklere \"koruyucu hak\" denir. Aşağıdakilerden hangisi koruyucu haklar arasında yer alır?",
          "options": [
            "Seçme ve seçilme hakkı",
            "Eğitim ve öğrenim hakkı",
            "Kamu yararı",
            "Sosyal güvenlik hakkı",
            "Mülkiyet hakkı"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 60,
          "questionText": "1982 Anayasası'nın temel hak ve özgürlüklere ilişkin maddelerinin yazımında özellikle hangi uluslararası sözleşme ile bir uyum ve paralellik sağlanması için çaba gösterilmiştir?",
          "options": [
            "Avrupa İnsan Hakları Sözleşmesi",
            "Çocuk Hakları Sözleşmesi",
            "Roma Sözleşmesi",
            "Kyoto Sözleşmesi",
            "Soykırım Suçunun Önlenmesi Sözleşmesi"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 61,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nda hiçbir şekilde durdurulamayacak temel hak ve özgürlüklerden biri sayılmamıştır?",
          "options": [
            "Yaşama hakkı",
            "Mülkiyet hakkı",
            "Suçluluğu mahkeme kararıyla ispatlanıncaya kadar kimsenin suçlu sayılamayacağı",
            "Kimsenin din, vicdan, düşünce ve kanaatlerini açıklamaya zorlanamaması",
            "Suç ve cezaların geçmişe yürümemesi"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 62,
          "questionText": "1982 Anayasası'na göre, mülkiyet hakkı aşağıdaki temel hak ve özgürlüklerden hangisi içinde düzenlenmiştir?",
          "options": [
            "Negatif statü hakları",
            "Aktif statü hakları",
            "Dayanaşma hakları",
            "Kolektif haklar",
            "Pozitif statü hakları"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 63,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın değiştirilemez ve değiştirilmesi teklif dahi edilemez maddelerinden biri değildir?",
          "options": [
            "Türkiye Devleti bir cumhuriyettir.",
            "Türkiye Devleti, ülkesi ve milletiyle bölünmez bir bütündür.",
            "Türkiye Devleti'nin bayrağı, şekli kanunda belirtilen beyaz ay yıldızlı al bayraktır.",
            "Türkiye Cumhuriyeti, demokratik, laik ve sosyal hukuk devletidir.",
            "Yürütme yetkisi ve görevi, Cumhurbaşkanı tarafından kullanılır ve yerine getirilir."
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 64,
          "questionText": "1982 Anayasası'na göre aşağıdakilerden hangisi devletin temel amaç ve görevleri arasında yer almaz?",
          "options": [
            "Kişinin temel hak ve hürriyetlerini sosyal hukuk devleti ve adalet ilkeleriyle bağdaşmayacak biçimde sınırlayan engelleri kaldırmaya çalışmak",
            "Türk milletinin bağımsızlığını ve bütünlüğünü korumak",
            "Seçilmişlerin üstünlüğünü sağlamak",
            "Cumhuriyeti ve demokrasiyi korumak",
            "Kişilerin ve toplumun refah, huzur ve mutluluğunu sağlamak"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 65,
          "questionText": "Aşağıdakilerden hangisi cumhuriyetin nitelikleri arasında yer alan demokratik devlet ilkesinin belirleyici özelliklerinden değildir?",
          "options": [
            "Temel siyasi karar organlarında görev alacakların halk tarafından seçilmesi",
            "Seçimlerin yargısal denetiminin bağımsız ve tarafsız yargı organlarınca yapılması",
            "Çok partili siyasi hayatın varlığı",
            "İdarenin faaliyetlerinin önceden bilinebilir olması",
            "Seçimlerin düzenli aralıklarla tekrarlanması"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 66,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın genel özellikleri arasında yer almaz?",
          "options": [
            "Türk anayasa tarihinin en sert ve en kazuistik anayasasıdır.",
            "Daha az katılımcı bir demokrasi modelini benimsemiştir.",
            "Halk oylaması sonucunda kabul edilmiştir.",
            "Kurucu Meclis tarafından hazırlanmıştır.",
            "Güçler birliği, görevler ayrılığı ilkesini benimsemiştir."
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 67,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın metnine dâhil değildir?",
          "options": [
            "Anayasanın yürürlüğe girmesine ilişkin 177. madde",
            "İnkılap Kanunları'nın korunmasına ilişkin 174. madde",
            "Anayasanın geçici maddeleri",
            "Anayasada bulunan madde ve kenar başlıkları",
            "Anayasanın başlangıç kısmı"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 68,
          "questionText": "1982 Anayasası'na göre temel hak ve özgürlüklerin kullanılması kısmen veya tamamen durdurulabilir. Buna göre; I. Seferberlik II. Tatbikat III. Olağanüstü hâl IV. Savaş hangisi temel hak ve özgürlüklerin kısmen ya da tamamen durdurulabileceği durumlardan biri değildir?",
          "options": [
            "Yalnız I",
            "Yalnız II",
            "II ve III",
            "III ve IV",
            "I, II, III ve IV"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 69,
          "questionText": "Eğitim ve öğrenim hakkı ve ödevi 1982 Anayasası’nın hangi bölümünde düzenlenmiştir?",
          "options": [
            "Siyasi haklar ve ödevler",
            "Temel hak ve ödevler",
            "Kişinin hakları ve ödevleri",
            "Genel hükümler",
            "Sosyal ve ekonomik haklar ve ödevler"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 70,
          "questionText": "Bir ülkede insanların haklarını ilgili kurumlara başvurarak arayabilmeleri için sahip olmaları gereken hak öncelikle aşağıdakilerden hangisidir?",
          "options": [
            "Seçme hakkı",
            "Dilekçe hakkı",
            "Yerleşme hakkı",
            "Özel yaşamın gizliliği",
            "Konut dokunulmazlığı hakkı"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 71,
          "questionText": "Aşağıdaki sosyal haklardan hangileri devletin mali gücüne bağlı olamaz?",
          "options": [
            "Sendika hakkı",
            "Sağlık hizmetlerinden faydalanma hakkı",
            "Eğitim hizmetlerinden faydalanma hakkı",
            "Sosyal güvenlik",
            "Konut hakkı"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 72,
          "questionText": "Aşağıdakilerden hangisi hakkında Cumhurbaşkanlığı kararnamesiyle düzenleme yapılabilir?",
          "options": [
            "Kişi hakları ve ödevleri",
            "Temel haklar",
            "Sosyal ve ekonomik haklar ve ödevler",
            "Kanunla açıkça düzenlenen konular",
            "Siyasi haklar ve ödevler"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 73,
          "questionText": "Kişileri, devlete ve topluma karşı koruyan hak ve özgürlüklere \"koruyucu hak\" denir. Aşağıdakilerden hangisi koruyucu haklar arasında yer alır?",
          "options": [
            "Seçme ve seçilme hakkı",
            "Eğitim ve öğrenim hakkı",
            "Kamu yararı",
            "Sosyal güvenlik hakkı",
            "Mülkiyet hakkı"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 74,
          "questionText": "1982 Anayasası'nın temel hak ve özgürlüklere ilişkin maddelerinin yazımında özellikle hangi uluslararası sözleşme ile bir uyum ve paralellik sağlanması için çaba gösterilmiştir?",
          "options": [
            "Avrupa İnsan Hakları Sözleşmesi",
            "Çocuk Hakları Sözleşmesi",
            "Roma Sözleşmesi",
            "Kyoto Sözleşmesi",
            "Soykırım Suçunun Önlenmesi Sözleşmesi"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 75,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nda hiçbir şekilde durdurulamayacak temel hak ve özgürlüklerden biri olarak sayılmamıştır?",
          "options": [
            "Yaşama hakkı",
            "Masumiyet karinesi",
            "Suçluluğu mahkeme kararıyla saptanıncaya kadar kimsenin suçlu sayılamayacağı",
            "Kimsenin din, vicdan, düşünce ve kanaatlerini açıklamaya zorlanamaması",
            "Suç ve cezaların geçmişe yürümemesi"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 76,
          "questionText": "1982 Anayasası'na göre, mülkiyet hakkı aşağıdaki temel hak ve özgürlüklerden hangisi içinde düzenlenmiştir?",
          "options": [
            "Negatif statü hakları",
            "Aktif statü hakları",
            "Dayanaşma hakları",
            "Kolektif haklar",
            "Pozitif statü hakları"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 77,
          "questionText": "I. Devlet harp ve vazife şehitlerinin dul ve yetimlerini korur, kendilerine yaraşır bir hayat seviyesi sağlar. II. Devlet sakatların korunmalarını ve toplum hayatına intibaklarını sağlayıcı tedbirleri alır. III. Devlet korumaya muhtaç çocukların topluma kazandırılması için her türlü tedbiri alır. Yukarıda verilenler 1982 Anayasası'na göre hangi hakkın kapsamında yer alır?",
          "options": [
            "Yerleşme ve seyahat etme hürriyeti",
            "Sağlık, çevre ve konut hakkı",
            "Özel hayatın gizliliği",
            "Siyasi faaliyetlerde bulunma hakkı",
            "Sosyal güvenlik hakkı"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 78,
          "questionText": "\"Kimse suç işlediği zaman, kanunda o suç için konulmuş olan cezadan daha ağır bir ceza verilemez\" hükmü, doktrinde ne ad verilir?",
          "options": [
            "Kıyas ilkesi",
            "Kanunilik ilkesi",
            "Temsilde adalet ilkesi",
            "Kanunların geriye yürümezliği",
            "Kusursuz ceza olmaz ilkesi"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 79,
          "questionText": "1982 Anayasası'na göre, temel hak ve özgürlüklerle ilgili aşağıdaki ifadelerden hangisi yanlıştır?",
          "options": [
            "Kişi dokunulmazlığı",
            "Kişinin maddi bütünlüğü",
            "Kişinin manevi bütünlüğü",
            "Kişinin iktisadi bütünlüğü",
            "Kişinin sosyal bütünlüğü"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 80,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın temel hak ve özgürlükler başlığı altında düzenlenen kamu yararı başlığı altında düzenlemeler arasında yer almaz?",
          "options": [
            "Toprak mülkiyeti",
            "Kamulaştırma",
            "Ormanların korunması",
            "Kıyılardan yararlanma",
            "Ücrette adalet sağlanması"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 81,
          "questionText": "1982 Anayasası'na göre aşağıdakilerden hangisi hem hak hem de ödev olarak düzenlenmiştir?",
          "options": [
            "Çalışma",
            "İspat",
            "Sendika kurma",
            "Sosyal güvenlik",
            "Kamu hizmetlerine girme"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 82,
          "questionText": "Aşağıdakilerden hangisi Türk vatandaşlarının siyasal haklarından biridir?",
          "options": [
            "Çalışma hakkı",
            "Mülkiyet hakkı",
            "Bilim ve sanat hürriyeti",
            "Din ve vicdan özgürlüğü",
            "Kamu hizmetlerine girme hakkı"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 83,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın siyasi haklar ve ödevler bölümünde düzenlenmiştir?",
          "options": [
            "Türk vatandaşlığı",
            "Ticaret ve sanayideki düzenlemeler",
            "Süreli ve süresiz yayın hakkı",
            "Konut dokunulmazlığı",
            "Basın hürriyeti"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 84,
          "questionText": "1982 Anayasası'na göre, grev ve lokavtın yasaklanabileceği veya ertelenebileceği aşağıdakilerden hangisiyle düzenlenir?",
          "options": [
            "Kanun",
            "Cumhurbaşkanlığı kararnamesi",
            "Yönetmelik",
            "Genelge",
            "Milletler arası antlaşma"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 85,
          "questionText": "Seçime katılan siyasi partilerin genel merkezleri radyo ve televizyonda propaganda yapmak istediklerini yazılı olarak aşağıdakilerden hangisine önceden bildirir?",
          "options": [
            "Türkiye Radyo ve Televizyon Kurumu",
            "Radyo ve Televizyon Üst Kurulu",
            "Yüksek Seçim Kurulu",
            "TBMM",
            "Anayasa Mahkemesi"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 86,
          "questionText": "Siyasi partilerin kurulabilmesi için en az kaç kişinin olması zorunludur?",
          "options": [
            "10",
            "30",
            "40",
            "50",
            "60"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 87,
          "questionText": "Anayasaya aykırı olarak, bir kimsenin evinde özel kâğıtlarının ve eşyalarının aranması ve alıkonulması aşağıdaki hürriyetlerden hangisini ihlal eder?",
          "options": [
            "Haberleşme hürriyeti",
            "Konut dokunulmazlığı",
            "Bilim ve sanat hürriyeti",
            "Yerleşme ve seyahat hürriyeti",
            "Din ve vicdan özgürlüğü"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 88,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisi sosyal ve ekonomik haklar ve ödevlerden biri değildir?",
          "options": [
            "Ailenin korunması",
            "Zorla çalıştırma yasağı",
            "Eğitim ve öğrenim hakkı",
            "Çalışma ve sözleşme hürriyeti",
            "Kamu yararı"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 89,
          "questionText": "Din ve vicdan hürriyetiyle ilgili aşağıda verilenlerden hangisi yanlıştır?",
          "options": [
            "Herkes vicdan, dini inanç ve kanaat hürriyetine sahiptir.",
            "Din ve ahlak eğitim ve öğretimi ilk ve ortaöğretimde öğrencilerin ve velilerin isteklerine göre yapılır.",
            "Temel hak ve hürriyetlerin kötüye kullanılmaması yasağı bu hürriyet için de geçerlidir.",
            "Kimse devletin sosyal, ekonomik, siyasi ve kişisel temel düzeninin, kısmen de olsa siyasi ve kişisel çıkar sağlama amacıyla dini ve din duygularını kullanamaz.",
            "Kanuna aykırı, emir ve talimatlarından dolayı kınanamaz ve suçlanamaz."
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 90,
          "questionText": "Aşağıdakilerden hangisi Cumhurbaşkanının görev süresi aşağıdakilerden hangisidir?",
          "options": [
            "1 yıl",
            "2 yıl",
            "4 yıl",
            "5 yıl",
            "3 yıl"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 91,
          "questionText": "Kişinin maddi ve manevi tüm varlığı ile ilgili bulunan ve bu varlığın korunması ve geliştirilmesi amacını güden hak ve hürriyetlere ne ad verilir?",
          "options": [
            "Siyasi haklar",
            "Kişisel haklar",
            "Kamu hakları",
            "Özel haklar",
            "Sosyal haklar"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 92,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'na göre kişinin siyasi hak ve ödevleri arasında yer almaz?",
          "options": [
            "Temel hak ve hürriyetlerin korunması",
            "Memuriyet hakkı",
            "Seçme, seçilme ve siyasi faaliyette bulunma hakkı",
            "Vergi ödevi",
            "Vatandaşlık"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 93,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'na göre sosyal güvenlik hakları bakımından özel olarak korunması gerekenler arasında yer almaz?",
          "options": [
            "Yaşlılar",
            "Kamu görevlileri",
            "Korunmaya muhtaç çocuklar",
            "Malüller ve gaziler",
            "Harp ve vazife şehitlerinin dul ve yetimleri"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 94,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'na göre temel hak ve özgürlüklerle ilgili düzenlemelerin temel esaslarından biri sayılmaz?",
          "options": [
            "Zorla çalıştırma yasağı",
            "Vatandaşlık ödevi",
            "Dernek kurma hürriyeti",
            "Yerleşme ve seyahat hürriyeti",
            "Sendika kurma hakkı"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 95,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'na göre temel hak ve özgürlüklerin kullanılması kısmen veya tamamen durdurulabilecek durumlardan biri değildir?",
          "options": [
            "Milletvekili dokunulmazlığının kaldırılması",
            "Savaş",
            "Seferberlik",
            "Olağanüstü hâl",
            "Tatbikat"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 96,
          "questionText": "1982 Anayasası'na göre aşağıdakilerden hangisi hem hak hem de ödev olarak düzenlenmiştir?",
          "options": [
            "Zorunlu askerlik ödevi",
            "Eğitim ve öğretim hakkı",
            "Mülkiyet hakkı",
            "Seçme hakkı",
            "Haberleşme hürriyeti"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 97,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'nın siyasi haklar ve ödevler bölümünde düzenlenmemiştir?",
          "options": [
            "Türk vatandaşlığı",
            "Seçme, seçilme ve siyasi faaliyette bulunma hakkı",
            "Dernek kurma hakkı",
            "Mal bildirimi",
            "Vergi ödevi"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 98,
          "questionText": "Aşağıdakilerden hangisi 1982 Anayasası'na göre sosyal haklar ve ödevler arasında yer almaz?",
          "options": [
            "Toprak mülkiyeti",
            "Çalışma hakkı",
            "Zorla çalıştırma yasağı",
            "Ücrette adalet sağlanması",
            "Kamu hizmetlerine girme"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 99,
          "questionText": "Kanun koyma ve kaldırma yetkisinin TBMM'de olmasına, yasama yetkisinin hiçbir şekilde devredilememesine ve yasama yetkisinin sürekli olmasına ne ad verilir? Yukarıdaki açıklamada boş bırakılan yerlere sırasıyla aşağıdakilerden hangisi getirilmelidir?",
          "options": [
            "asıllığı - genelliği",
            "devredilmezliği - asıllığı",
            "genelliği - devredilmezliği",
            "asıllığı - sürekliliği",
            "devredilmezliği - sürekliliği"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 100,
          "questionText": "TBMM genel oyla seçilen kaç milletvekilinden oluşur?",
          "options": [
            "600",
            "500",
            "450",
            "400",
            "500"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 101,
          "questionText": "Aşağıdakilerden hangisi milletvekili seçilmeye engel oluşturmaktadır?",
          "options": [
            "Türk vatandaşı olmakla birlikte çifte vatandaşlığı bulunmak",
            "Kamu hizmetlerinden yasaklı olmamak",
            "Askerlik hizmetini yerine getirmiş olmak",
            "Kısıtlılık durumu",
            "En az ilkokul mezunu olmak"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 102,
          "questionText": "Seçimlerde yurt dışındaki vatandaşların kullandıkları oylar aşağıdaki şehirlerin hangisinde toplanıp yurt içi oylarına dahil edilmektedir?",
          "options": [
            "Ankara",
            "İstanbul",
            "Konya",
            "Bursa",
            "İzmir"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 103,
          "questionText": "Aşağıdakilerden hangisi seçmenlerin verdikleri oyların yasama organındaki sandalyelere dönüştürülmesinde uygulanan kurallar bütününde ifade eder?",
          "options": [
            "Seçim sistemi",
            "Siyasal sistem",
            "Merkezi yönetim",
            "Devlet biçimi",
            "Parti sistemi"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 104,
          "questionText": "Aşağıdakilerden hangisi yasama organının yürütme organını ilgilendiren kararlarından biridir?",
          "options": [
            "Meclis başkanının seçilmesi",
            "Meclis başkanlık divanının seçilmesi",
            "TBMM iç tüzüğünün hazırlanması",
            "Cumhurbaşkanı hakkında yapılan soruşturma neticesinde cumhurbaşkanının Yüce Divana sevk edilmesi",
            "TBMM iç tüzüğünün değiştirilmesi"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 105,
          "questionText": "Aşağıdakilerden hangisi özel nitelikli kanunlardan biridir?",
          "options": [
            "Hukuk Usulü Muhakemeleri Kanunu",
            "Ceza Usulü Muhakemeleri Kanunu",
            "Bütçe Kanunu",
            "İş Kanunu",
            "Ailenin Korunmasına Dair Kanunu"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 106,
          "questionText": "Yasama organının bir konuyu doğrudan ve araya bir başka işlem girmeksizin düzenlemesine ne ad verilir?",
          "options": [
            "Kanunların genelliği",
            "Yasama yetkisinin genelliği",
            "Kuvvetler ayrılığı ilkesi",
            "Yasama yetkisinin devredilmezliği",
            "Yasama yetkisinin asilliği"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 107,
          "questionText": "Türkiye Cumhuriyeti Anayasasına göre TBMM'nin bilgi edinme ve denetim yolları arasında gösterilemez?",
          "options": [
            "Yazılı soru",
            "Genel görüşme",
            "Sözlü soru",
            "Meclis araştırması",
            "Meclis soruşturması"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 108,
          "questionText": "Aşağıdakilerden hangisi anayasa değişikliğinin kabulü için yapılan halk oylamasının usulüne uygun olarak yapılıp yapılmadığını denetlemekle yetkilidir?",
          "options": [
            "İl Seçim Kurulu",
            "Yüksek Seçim Kurulu",
            "Anayasa Mahkemesi",
            "Bölge İdare Mahkemesi",
            "Sayıştay"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 109,
          "questionText": "Aşağıdakilerden hangisi TBMM seçimlerinin özellikleri arasında yer almaz?",
          "options": [
            "Seçimler yargı organlarının yönetim ve denetimi altında yapılır.",
            "TBMM üyeleri milletçe genel oyla seçilir.",
            "Seçimlerde, bazı seçmenlerin ağırlıklı oy hakkı bulunmaktadır.",
            "Seçimler tek dereceli olarak yapılır.",
            "Cumhurbaşkanlığı seçimiyle aynı gün yapılır."
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 110,
          "questionText": "Siyasi parti gruplarının yasama dokunulmazlığının kaldırılmasına ilişkin görüşme yapmaması ve karar almaması aşağıdaki amaçlardan hangisine yöneliktir?",
          "options": [
            "Yasama organının etkinliğini artırmak",
            "Dokunulmazlık kararının alınması sürecini hızlandırmak",
            "Meclisteki partiler arasındaki rekabeti dengelemek",
            "Cumhurbaşkanı yardımcılarının çalışmalarında özerkliği sağlamak",
            "Milletvekillerinin kendi siyasi partilerinin baskısı altında kalmamasını sağlamak"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 111,
          "questionText": "TBMM, süresi bitmekte olan olağanüstü hâl durumunu en fazla ne kadar uzatabilir?",
          "options": [
            "45 gün",
            "3 ay",
            "4 ay",
            "6 ay",
            "10 ay"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 112,
          "questionText": "Aşağıda verilenlerden hangisi milletvekilliğinin düştüğü hallerden biri değildir?",
          "options": [
            "Milletvekili görevinden istifa etme",
            "Milletvekilinin Meclis başkanlığına seçilmesi",
            "Milletvekilinin bakan olarak atanması",
            "Milletvekilliğiyle bağdaşmayacak bir görev veya hizmeti kendiliğinden icra etme",
            "Seçilmeye engel bir suçtan hüküm giyme"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 113,
          "questionText": "TBMM üyelerinin el kaldırmaları ile yapılan oylama tipi aşağıdakilerden hangisidir?",
          "options": [
            "İşaretle oylama",
            "Açık oylama",
            "Kapalı oylama",
            "Serbest oylama",
            "Gizli oylama"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 114,
          "questionText": "TBMM seçimleriyle ilgili aşağıda verilen ifadelerden hangisinde bir bilgi yanlışı söz konusudur?",
          "options": [
            "Savaş sebebiyle yeni seçimler yapılmasına imkân görülmezse TBMM, seçimleri 1 yıl geriye bırakabilir.",
            "TBMM üyeliklerinde boşalma olması halinde boşalan üyeliklerin yerinin doldurulması için ara seçim yapılır.",
            "Cumhurbaşkanı yardımcıları TBMM seçimlerinin yenilenmesine karar verebilir.",
            "TBMM seçimleri Cumhurbaşkanlığı seçimiyle aynı gün ve 5 yılda bir yapılır.",
            "Türkiye Büyük Millet Meclisi, üye tamsayısının beşte üç çoğunluğyla seçimlerin yenilenmesine karar verebilir."
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 115,
          "questionText": "Aşağıdakilerden hangleri TBMM'de zorunlu gizli oylama gerektiren hallerden biri değildir?",
          "options": [
            "TBMM Başkanlık seçimi",
            "Yüce Divana sevk ilişkini oylama",
            "Anayasa değişikliği teklifinin oylanması",
            "Milletvekilinin düşmesi ile ilgili kararlar için yapılacak oylama",
            "Bütçe kanununun kabulü"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 116,
          "questionText": "TBMM iç tüzük değişikliklerini inceleme ve denetleme yetkisi aşağıdakilerden hangisine aittir?",
          "options": [
            "Anayasa Mahkemesi",
            "Yargıtay",
            "Danıştay",
            "Sayıştay",
            "Uyuşmazlık Mahkemesi"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 117,
          "questionText": "Meclis araştırması ile ilgili aşağıda verilen ifadelerin hangisinde bir bilgi yanlışı vardır?",
          "options": [
            "Belli bir konuda bilgi edinmek için yapılan incelemeden ibarettir.",
            "Meclis araştırması yapılabilmesi için önce Meclis'e önerge verilir.",
            "Öncelikle ön görüşme yapılır, daha sonra araştırma yapılıp yapılmaması oylanır.",
            "Meclisteki siyasi parti gruplarında, Meclis soruşturması ile ilgili görüşme yapılamaz ve karar alınamaz.",
            "Cezalandırma durumu yaratan denetleme yollarından biridir."
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 118,
          "questionText": "Tatil veya ara verme sırasında Meclis başkanı en az kaç milletvekilinin yazılı istemiyle Meclisi toplantıya çağrabilir?",
          "options": [
            "100 milletvekili",
            "120 milletvekili",
            "150 milletvekili",
            "200 milletvekili",
            "250 milletvekili"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 119,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisi TBMM'nin görev ve yetkilerinden biri değildir?",
          "options": [
            "Para basılmasına karar vermek",
            "Kamu başdenetçisini seçmek",
            "Kesin hesap kanun tekliflerini görüşmek ve kabul etmek",
            "Savaş ilanına karar vermek",
            "Milletlerarası antlaşmaları onaylamak ve yürürlüğe girmelerine karar vermek"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 120,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisi siyasi partilerin üye tamsayısının salt çoğunlukla alabileceği kararlardan biri değildir?",
          "options": [
            "Parti tüzüğünün değiştirilmesi",
            "Parti programının kabulü",
            "Parti genel başkanının seçimi",
            "Parti organlarının seçimi",
            "Parti üyeliğinin düşürülmesi"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 121,
          "questionText": "1982 Anayasası'na göre, TBMM'nin yapısı ve işleyişi ile ilgili aşağıdaki ifadelerden hangisi yanlıştır?",
          "options": [
            "TBMM seçimleri 5 yılda bir yapılır.",
            "TBMM'nin toplanıp görüşmeye başlayabilmesi için üye tamsayısının en az 1/3 oranında milletvekilinin hazır bulunması gerekir.",
            "TBMM çalışmalarını kendi yaptığı iç tüzük hükümlerine göre yürütür.",
            "TBMM Genel Kurulunda görüşmeler başkaca bir karar alınmadıkça açıktır ve her türlü vasıta ile yayımlanır.",
            "TBMM, genel oyla seçilen 600 milletvekilinden oluşur."
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 122,
          "questionText": "Anayasaya aykırı olmak kaydıyla kural olarak her konu bir kanunla düzenlenebilir. Buna göre; I. Kanunların yürürlüğe girmesi II. TBMM üye tamsayısının 3/5'inin yazılı istemi üzerine TBMM'nin toplantıya çağrılması III. Yüce Divana sevk kararı IV. TBMM Genel Kurulu'nda birleşme oranı Yukarıdakilerden hangilerinin yasama yetkisinin genelliği ilkesi ile bir ilgisi yoktur?",
          "options": [
            "I, II ve III",
            "I, III ve IV",
            "I, II ve IV",
            "II, III ve IV",
            "Yalnız I"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 123,
          "questionText": "TBMM görüşmeleri ve oylama usulüyle ilgili aşağıda verilen ifadelerden hangisi yanlıştır?",
          "options": [
            "Meclis görüşmeleri bir gündeme göre sırasıyla yapılır.",
            "TBMM Genel Kurulundaki görüşmelerin tam metni Tutanak Dergisi'nde yayımlanır.",
            "Bir milletvekili birleşime katılmayan başka bir milletvekili yerine oy kullanabilir.",
            "Kapalı oturum yapılması meclisteki görüşmelerin yayımlanmasında meclis kararına bağlıdır.",
            "TBMM görüşmeleri açık yapılır."
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 124,
          "questionText": "Aşağıdakilerden hangisi siyasi partilere üye olamayan kamu görevlileri arasında gösterilemez?",
          "options": [
            "Yüksek yargı organları mensupları",
            "Kamu kurum ve kuruluşlarında çalışan memurlar",
            "Hâkimler ve savcılar",
            "Kamu işçileri",
            "Kamu hizmetlerinden yararlananlar"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 125,
          "questionText": "Aşağıdakilerden hangisi yasama organının yetkilerini hiçbir kayıt olmaksızın, kendi adına ve dilediği konuyu düzenleyebileceği anlamına gelir?",
          "options": [
            "Yasama yetkisinin genelliği",
            "Yetki genelliği",
            "Genel idare",
            "Genel oy",
            "Yasama yetkisinin asilliği"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 126,
          "questionText": "1982 Anayasası'na göre aşağıdakilerden hangileri siyasi partilerin uyması yükümlü oldukları esaslardan biri değildir?",
          "options": [
            "Siyasi partilerin parti içi düzenlemelerinin ve çalışmalarının demokrasi ilkelerine uymak",
            "Siyasi partilerin kendi siyasetlerinin yürütmek açısından dernekler, sendikalar ve vakıflarla siyasi ilişki içinde bulunma yasağı",
            "Siyasi partilerin ticari faaliyette girme yasağı",
            "Siyasi partilerin gelir ve giderlerinin amaçlarına uygun olma zorunluluğu",
            "Siyasi partilerin yabancı devletlerden, uluslararası kuruluşlardan ve Türk uyruğunda olmayan gerçek ve tüzel kişilerden maddi yardım alma yasağı"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 127,
          "questionText": "1982 Anayasası'na göre aşağıdakilerden hangilerden biri milletvekili olmaya engel teşkil eden hallerden biri değildir?",
          "options": [
            "Kamu hizmetinden yasaklı olmak",
            "Mahkeme kararıyla kısıtlanmış olmak",
            "Son 1 yıldır adaylığın koyduğu seçim çevresinde ikamet etmiyor olmak",
            "Taksirli suçlardan hüküm giymiş olmak",
            "Yüz kızartıcı suçlar işlemek"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 128,
          "questionText": "TBMM'nin denetim yollarından hangisi ya da hangilerinin zorunluda milletvekilliğinin düşmesine gerek vardır? I. İstifa II. Devamsızlık III. Bağdaşmazlık IV. Bakan olarak atanma",
          "options": [
            "Yalnız I",
            "Yalnız II",
            "I ve III",
            "II ve III",
            "I, II ve III"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 129,
          "questionText": "I. Silah altında bulunan er ve erbaşlar II. Askerî öğrenciler III. İdeolojik ve anarşik eylemlerden ötürü hüküm giymiş olup, af kanunu nedeniyle tahliye edilenler IV. Yurt dışına ikamet eden Türk vatandaşları V. Taksirli suçlardan hüküm giyenler harp, ceza infaz kurumunda bulunan hükümlüler",
          "options": [
            "I, II ve III",
            "I, II ve IV",
            "I, III ve V",
            "II, IV ve V",
            "I, III, IV ve V"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 130,
          "questionText": "Cumhurbaşkanı yardımcıları ve bakanların görevleri ile ilgili cezai sorumluluklarını ilgilendiren durumlarda yargılamayı aşağıdakilerden hangisi yapar?",
          "options": [
            "Yüce Divan sıfatıyla Anayasa Mahkemesi",
            "Meclis",
            "Yargıtay",
            "Danıştay",
            "Danıştay"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 131,
          "questionText": "Cumhurbaşkanlığı adaylığı ve seçilme yeterliliği ile ilgili aşağıda verilen ifadelerin hangisinde bir bilgi yanlışı vardır?",
          "options": [
            "Cumhurbaşkanı, milletvekili seçilme yeterliliğine sahip, Türk vatandaşları arasından doğrudan halk tarafından seçilir.",
            "Cumhurbaşkanlığına aday kişinin 40 yaşını doldurmuş olması gerekir.",
            "Yükseköğrenim yapmak Cumhurbaşkanı seçilme yeterliliklerindendir.",
            "Siyasi parti grupları Cumhurbaşkanlığına aday gösterebilirler.",
            "En son yapılan genel seçimlerde toplam geçerli oyların tek başına veya birlikte en az %3'ünü almış olan siyasi partiler Cumhurbaşkanlığına aday gösterebilirler."
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 132,
          "questionText": "Aşağıdakilerden hangisi Cumhurbaşkanının görevlerinden biri değildir?",
          "options": [
            "Bakanları atamak",
            "Millî güvenlik politikalarını belirlemek",
            "Ülkenin iç ve dış siyaseti hakkında meclise mesaj vermek",
            "Türk Silahlı Kuvvetlerinin kullanılmasına karar vermek",
            "Savaş ilanına karar vermek"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 133,
          "questionText": "Aşağıdakilerden hangisi yürütme organı ya da bu organa bağlı olarak görev yapan kurumlar arasında yer almaz?",
          "options": [
            "Cumhurbaşkanı",
            "Cumhurbaşkanı yardımcıları",
            "Devlet Denetleme Kurulu",
            "TBMM Başkanı",
            "Bakanlar"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 134,
          "questionText": "Aşağıdakilerden hangisi Cumhurbaşkanı tarafından atanmaz?",
          "options": [
            "Anayasa Mahkemesi üyelerinin bir kısmı",
            "HSK üyelerinin bir kısmı",
            "Yargıtay üyelerinin bir kısmı",
            "Üst kademe yöneticileri",
            "Danıştay üyelerinin bir kısmı"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 135,
          "questionText": "2017 yılında yapılan referandumla kabul edilen ve 2018 erken seçimiyle yürürlüğe giren anayasa değişikliğine göre yürütme yetki ve görevi aşağıdakilerden hangisine verilmiştir?",
          "options": [
            "Bakanlara",
            "Cumhurbaşkanı yardımcılarına",
            "En fazla oyu alan siyasi partiye",
            "Cumhurbaşkanına",
            "Milletvekillerine"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 136,
          "questionText": "En az kaç bin seçmenin imzasıyla bir kişi cumhurbaşkanlığına aday gösterilebilir?",
          "options": [
            "150 bin",
            "100 bin",
            "75 bin",
            "50 bin",
            "55 bin"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 137,
          "questionText": "Hakkında soruşturma açılmasına karar verilen bir bakanın soruşturma sonucunda Yüce Divana sevk edilmesi için TBMM'de yapılan oylamada üye tamsayısının göre hangi çoğunluk aranır?",
          "options": [
            "1/5",
            "2/3",
            "3/5",
            "3/4",
            "1/4"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 138,
          "questionText": "1982 Anayasası'na göre, Cumhurbaşkanı ile ilgili aşağıda verilenlerden hangisi yanlıştır?",
          "options": [
            "Cumhurbaşkanı doğrudan halk tarafından seçilir.",
            "Kanunları yayımlamak Cumhurbaşkanının görevleri arasında yer alır.",
            "Cumhurbaşkanı aynı zamanda devletin de başıdır.",
            "Cumhurbaşkanı olabilmek için Türk vatandaşı olmak gerekir.",
            "Bir kişi en fazla bir defa Cumhurbaşkanı seçilebilir."
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 139,
          "questionText": "Türk Silahlı Kuvvetlerinin başkomutanlığı aşağıdakilerden hangisi tarafından temsil olunur?",
          "options": [
            "TBMM",
            "TBMM başkanı",
            "Genelkurmay başkanı",
            "Cumhurbaşkanı",
            "Millî Savunma bakanı"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 140,
          "questionText": "Olağanüstü hâl ile ilgili aşağıdaki ifadelerden hangisi yanlıştır?",
          "options": [
            "Olağanüstü hâl kararı Resmî Gazete'de yayımlanır.",
            "İdarenin yetkileri normal zamanlara göre daha kısıtlıdır.",
            "İdarenin yetkileri normal zamanlara göre daha geniştir.",
            "Temel hak ve özgürlüklere normal zamandakinden daha fazla sınırlama getirilir.",
            "Cumhurbaşkanı tarafından ilan edilir."
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 141,
          "questionText": "Cumhurbaşkanının yetki ve görevleriyle ilgili aşağıda verilenlerden hangisi yanlıştır?",
          "options": [
            "TBMM seçimlerinin yenilenmesine karar vermek",
            "TSK'nın kullanılmasına karar vermek",
            "Sayıştay Başkanını atamak",
            "Genelkurmay Başkanını atamak",
            "Milletlerarası antlaşmaları onaylamak ve yayımlamak"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 142,
          "questionText": "Aşağıdakilerden hangisi Cumhurbaşkanının görevi esnasında gecikmesini gerektiren nedenlerden değildir?",
          "options": [
            "Yurt dışına çıkma",
            "Hastalık",
            "Ölüm",
            "Çekilme",
            "Yurt içi gezisi"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 143,
          "questionText": "Cumhurbaşkanlığı seçimine ilişkin aşağıdaki ifadelerden hangisi yanlıştır?",
          "options": [
            "Cumhurbaşkanı milletvekilleri arasından seçilebileceği gibi milletvekili olmayanlardan da seçilebilir.",
            "Cumhurbaşkanı doğrudan halk tarafından seçilir.",
            "Cumhurbaşkanlığına adayların yükseköğrenim görmüş olması gerekir.",
            "Genel oyla yapılacak seçimde geçerli oyların salt çoğunluğunu alan aday Cumhurbaşkanı seçilir.",
            "Yükseköğrenim görmüş Türk vatandaşları arasından seçilebilir."
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 144,
          "questionText": "Millî Güvenlik Kurulu Genel Sekreterliğinin teşkilat ve görevleri aşağıdakilerden hangisiyle düzenlenir?",
          "options": [
            "Kanun",
            "Yönetmelik",
            "İç Tüzük",
            "Genelge",
            "Cumhurbaşkanlığı kararnamesi"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 145,
          "questionText": "Cumhurbaşkanlığı makamının herhangi bir sebeple boşalması halinde yeni seçilinceye kadar Cumhurbaşkanlığına kim vekâlet eder?",
          "options": [
            "Cumhurbaşkanı yardımcısı",
            "TBMM başkanı",
            "TBMM başkanı veya en yaşlı milletvekili",
            "En yaşlı bakan",
            "TBMM genel kurulu"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 146,
          "questionText": "Cumhurbaşkanı hakkında cezai sorumluluk ile ilgili verilen ifadelerden hangisi yanlıştır?",
          "options": [
            "Yüce Divana sevk edilen Cumhurbaşkanı, yargılaması üç ay içinde tamamlanmak üzere yükümlülük altına alınır.",
            "Soruşturma açılmasına karar verilmesi halinde, TBMM üye tamsayısının üçte ikisinin oylarıyla Yüce Divan'a sevk kararı alınır.",
            "Hakkında soruşturma açılmasına karar verilen Cumhurbaşkanı, görevden çekilir.",
            "TBMM üye tamsayısının beşte üç çoğunluğunun vereceği önergeyle bir suç isnadı ile Cumhurbaşkanı hakkında soruşturma açılması istenebilir.",
            "Yüce Divan'a sevk kararı alınmasıyla Cumhurbaşkanının görevi sona erer."
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 147,
          "questionText": "Siyasi partilerin ya da parti gruplarının Cumhurbaşkanlığına aday göstermesi ile ilgili; I. Her siyasi parti ya da parti grubu ancak bir aday gösterebilir. II. Bir kişinin birden fazla siyasi parti veya parti grubu adına aday gösterilebilir. III. Siyasi parti ya da parti grupları adına aday gösterilen kişiler milletvekili olmalıdır. yargılarından hangileri doğrudur?",
          "options": [
            "Yalnız I",
            "Yalnız II",
            "I ve II",
            "I, II ve III",
            "Yalnız III"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 148,
          "questionText": "Cumhurbaşkanı yardımcıları ve bakanlarla ilgili aşağıdaki ifadelerin hangisinde bir bilgi yanlışı vardır?",
          "options": [
            "Cumhurbaşkanı yardımcıları ve bakanlar Cumhurbaşkanı tarafından atanır ve görevden alınırlar.",
            "Cumhurbaşkanlığı kararnamesi çıkarabilirler.",
            "TBMM önünde and içerler.",
            "Görevleriyle ilgili olmayan suçlarda yasama dokunulmazlığına ilişkin hükümlerden yararlanırlar.",
            "TBMM üyeleri Cumhurbaşkanı yardımcılığı ya da bakan olarak atanabilir."
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 149,
          "questionText": "Aşağıdakilerden hangisi olağanüstü hâl süresini değiştirme yetkisine sahiptir?",
          "options": [
            "Cumhurbaşkanı",
            "TBMM",
            "TBMM başkanı",
            "Millî Güvenlik Kurulu",
            "Millî Güvenlik Kurulu"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 150,
          "questionText": "1982 Anayasası'na göre aşağıdakilerden hangisinin göreve gelmesinde doğrudan halkın görüşüne başvurulmaz, Cumhurbaşkanı tarafından atanır?",
          "options": [
            "Danıştay üyelerinin dörtte birinin",
            "Yargıtay Cumhuriyet Başsavcısının",
            "Hâkimler ve Savcılar Kurulu üyelerinden bir kısmının",
            "Bakanların",
            "Yüksek Seçim Kurulu üyelerinin"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 151,
          "questionText": "Aşağıda verilenlerden hangisi Devlet Denetleme Kurulu'na idari soruşturma, inceleme, denetleme yapma yetkisi verilen kuruluşlar arasında gösterilemez?",
          "options": [
            "Türk Silahlı Kuvvetleri",
            "Harp dizgâhları",
            "Kamu yararına çalışan dernekler ve vakıflar",
            "Kamu kurumu niteliğinde olan meslek kuruluşları",
            "Yükseköğretim Kurulu üyeleri"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 152,
          "questionText": "Devlet Denetleme Kurulunun işleyişi, üyelerinin görev süresi ve diğer özlük işleri aşağıdakilerden hangisi ile gerçekleştirilir?",
          "options": [
            "Önerge",
            "Cumhurbaşkanlığı kararnamesi",
            "Kanun",
            "Genelge",
            "Yönetmelik"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 153,
          "questionText": "Sürekli hastalık, sakatlık ve kocama sebebiyle Cumhurbaşkanlığı makamının boşalırsa vekâlet etme yetkisi aşağıdakilerden hangisine verilmiştir?",
          "options": [
            "TBMM başkanı",
            "Cumhurbaşkanı yardımcısı",
            "TBMM",
            "TBMM",
            "Adalet bakanı"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 154,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisinin göreve atanmasında Cumhurbaşkanının etkisi yoktur?",
          "options": [
            "Anayasa Mahkemesi üyeleri",
            "Devlet Denetleme Kurulu başkanı ve üyeleri",
            "Yükseköğretim Kurulu üyeleri",
            "Üst kademe kamu yöneticileri",
            "Radyo ve Televizyon Üst Kurulu üyeleri"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 155,
          "questionText": "2017 Referandumuyla kabul edilen anayasa değişikliği sonrasında, Cumhurbaşkanlığı seçimleri kimse hem milletvekilliğine hem de Cumhurbaşkanlığına aday olamaz. Cumhurbaşkanlığı seçimi ile ilgili aşağıdakilerden hangisi doğrudur?",
          "options": [
            "Cumhurbaşkanlığı seçimine katılacak adayların yükseköğrenim görmüş olması gerekir.",
            "Bir kimse hem milletvekilliğine hem de cumhurbaşkanlığına aday olamaz.",
            "Cumhurbaşkanlığı seçimi ile TBMM seçimleri 4 yılda bir aynı gün yapılır.",
            "Cumhurbaşkanlığına aday olma kişinin sözlü olarak başvurusuna gerek yoktur.",
            "Cumhurbaşkanı seçilen milletvekilinin TBMM üyeliği devam eder."
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 156,
          "questionText": "Aşağıdakilerden hangisi tabii afet ve tehlikeli salgın hastalıklar nedeniyle ilan edilen olağanüstü hâl durumunda alınan önlemlerden biri değildir?",
          "options": [
            "Belli yerlere giriş ve çıkışı sınırlamak",
            "Belli yerleşim yerlerini yasaklamak",
            "Belli yerlerde yerleşimi yasaklamak",
            "OHAL bölgesine dışarıdan giren kişilere karşı önlem alınması",
            "Belirli yerlerde toplanmayı yasaklamak"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 157,
          "questionText": "Cumhurbaşkanlığı makamının herhangi bir sebeple boşalması durumunda cumhurbaşkanlığı seçimlerinin genel seçime ne kadar süre kala yapılması TBMM'nin kararına bağlıdır?",
          "options": [
            "1 yıl ve daha az süre",
            "15 ay ve daha az süre",
            "8 ay ve daha az süre",
            "7 ay ve daha az süre",
            "9 ay ve daha az süre"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 158,
          "questionText": "Millî güvenliğin sağlanmasından ve Silahlı Kuvvetlerinin TBMM'ye karşı aşağıdakilerden hangisi sorumludur?",
          "options": [
            "Genelkurmay başkanı",
            "Millî Savunma bakanı",
            "Cumhurbaşkanı yardımcısı",
            "TBMM başkanı",
            "Cumhurbaşkanı"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 159,
          "questionText": "Cumhurbaşkanlığı seçiminin birinci oylamada sonuçlanması için genel oylamadan sağlanması gereken oy oranı aşağıdakilerden hangisidir?",
          "options": [
            "Salt çoğunluğu",
            "2/3 oy çoğunluğu",
            "3/4 oy çoğunluğu",
            "Mutlak çoğunluğu",
            "1/4 oy çoğunluğu"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 160,
          "questionText": "I. Siyasi parti grupları II. En son yapılan genel seçimlerde toplam geçerli oyların tek başına veya birlikte en az yüzde beşini almış olan siyasi partiler III. En az yüz bin seçmen Yukarıda verilenlerden hangileri Cumhurbaşkanlığına aday gösterebilir?",
          "options": [
            "Yalnız I",
            "Yalnız II",
            "I, II ve III",
            "Yalnız III",
            "I ve II"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 161,
          "questionText": "Bakanlıkların kurulması, kaldırılması, görevleri ve yetkileri, teşkilat yapısı ile merkez ve taşra teşkilatlarının kurulması aşağıdakilerden hangisi ile gerçekleştirilir?",
          "options": [
            "Kanun",
            "Yönetmelik",
            "Genelge",
            "Cumhurbaşkanlığı kararnamesi",
            "Emir"
          ],
          "correctAnswerIndex": 3
        },
        {
          "id": 162,
          "questionText": "Aşağıda verilenlerden hangisi Millî Güvenlik Kurulu üyesi değildir?",
          "options": [
            "Cumhurbaşkanı",
            "Cumhurbaşkanı Yardımcıları",
            "Dışişleri Bakanı",
            "Hava Kuvvetleri Komutanı",
            "Jandarma Genel Komutanı"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 163,
          "questionText": "Cumhurbaşkanı tarafından yurdun tamamında veya bir bölgesinde ilan edilen olağanüstü hâl süresi aşağıdakilerden hangisiyle sınırlıdır?",
          "options": [
            "12 ay",
            "9 ay",
            "6 ay",
            "5 ay",
            "6 ay"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 164,
          "questionText": "Silahlı Kuvvetlerin komutanı olarak savaşta başkomutanlık görevlerini Cumhurbaşkanlığı namına aşağıdakilerden hangisi yerine getirir?",
          "options": [
            "Millî Savunma Bakanı",
            "Kara Kuvvetleri Komutanı",
            "Cumhurbaşkanı Yardımcısı",
            "Dışişleri Bakanı",
            "Genelkurmay Başkanı"
          ],
          "correctAnswerIndex": 4
        },
        {
          "id": 165,
          "questionText": "Millî Güvenlik Kuruluna yönelik aşağıda verilen ifadelerin hangisinde bir bilgi yanlışı söz konusudur?",
          "options": [
            "Gündemin özelliğine göre toplantılarına Cumhurbaşkanı katılmazlığı zamanlarda Millî Güvenlik Kurulu, Cumhurbaşkanı Yardımcılarının başkanlığında toplanır.",
            "Millî Güvenlik Kurulu Genel Sekreterliğinin teşkilatı ve görevleri kanunla düzenlenir.",
            "Gündem oluşturulurken Genelkurmay başkanı ve cumhurbaşkanı yardımcılarının önerileri dikkate alınarak millî güvenlik siyasetinin tayini, tespiti ve uygulanması ile ilgili kararlar alınır.",
            "Cumhurbaşkanı başkanlığında en az iki ayda bir toplanır.",
            "Millî Güvenlik Kurulu kararları tavsiye niteliğindedir."
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 166,
          "questionText": "Cumhurbaşkanlığı kararnamesine aykırılık ve denetimine yönelik, aşağıdakilerden hangisinin yapılması beklenemez?",
          "options": [
            "TBMM Başkanlık Divanı",
            "Devlet Denetleme Kurulu",
            "İçişleri Bakanlığı",
            "Millî Güvenlik Kurulu",
            "Millî Savunma Bakanlığı"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 167,
          "questionText": "1982 Anayasası'na göre, aşağıdakilerden hangisinin göreve atanmasında Cumhurbaşkanının etkisi yoktur?",
          "options": [
            "Anayasa Mahkemesi üyeleri",
            "Devlet Denetleme Kurulu başkanı ve üyeleri",
            "Yükseköğretim Kurulu üyeleri",
            "Üst kademe kamu yöneticileri",
            "Radyo ve Televizyon Üst Kurulu üyeleri"
          ],
          "correctAnswerIndex": 4
        }
      ],
      "summary": "1982 Anayasası, Türkiye'nin en üst hukuki normu olarak devletin temel yapısını, organlarını (Yasama, Yürütme, Yargı), temel hak ve hürriyetleri düzenler. Güçler ayrılığı ilkesini benimser. Değiştirilemez maddeleri arasında devletin şeklinin Cumhuriyet olduğu, bayrağı, milli marşı ve başkenti yer alır. Temel hak ve hürriyetler, ancak kanunla ve Anayasa'nın ruhuna uygun olarak sınırlanabilir.",
      "flashcards": [],
      "isFavorite": false
    },
    {
      "id": "ttk-sozlesmeli-personel-sicil-amirligi-yonetmeligi-6",
      "name": "TTK Sözleşmeli Personel Sicil Amirliği Yönetmeliği",
      "iconName": "History",
      "color": "bg-orange-500/20",
      "bgColor": "bg-orange-900/40",
      "questions": [
        {
          "id": 1,
          "questionText": "TTK Sözleşmeli Personel Sicil Amirleri Yönetmeliği'ne göre, sicil amirleri personelin sicil raporlarını hangi dönemde düzenlemek zorundadır?",
          "options": [
            "Her yılın Ocak ayının ilk haftası",
            "Her yılın Haziran ayında",
            "Her yılın Aralık ayının ikinci yarısı içinde",
            "İki yılda bir Kasım ayında"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 2,
          "questionText": "Sicil raporlarında personelin hangi niteliği değerlendirme konuları arasında yer almaz?",
          "options": [
            "Mesleki bilgi ve tecrübesi",
            "Çalışkanlığı ve iş başarısı",
            "Kişisel sosyal yaşantısı",
            "Disiplin ve kurallara uyumu"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 3,
          "questionText": "Birinci ve ikinci sicil amirlerinin aynı kişi olması durumunda nasıl bir işlem yapılır?",
          "options": [
            "Sicil raporu düzenlenmez",
            "Sadece birinci sicil amiri raporu doldurur",
            "Genel Müdür tarafından özel bir sicil amiri atanır",
            "Bu yönetmelik hükümleri uygulanmaz"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 4,
          "questionText": "Sicil notu 'yetersiz' olarak değerlendirilen bir personel hakkında yapılacak ilk işlem nedir?",
          "options": [
            "Sözleşmesi derhal feshedilir",
            "Başka bir sicil amirinin yanında altı ay daha denenir",
            "Maaşından kesinti yapılır",
            "Yazılı olarak uyarılır"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 5,
          "questionText": "Sicil raporlarına itiraz süresi, raporun personele tebliğ edildiği tarihten itibaren kaç gündür?",
          "options": [
            "3 gün",
            "7 gün",
            "15 gün",
            "30 gün"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 6,
          "questionText": "Sicil raporları, personelin hangi durumu için temel alınır?",
          "options": [
            "Yıllık izin planlaması",
            "Başarı, verimlilik ve gayretlerini ölçmek",
            "Sosyal aktivitelere katılımı",
            "Sendikal tercihi"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 7,
          "questionText": "Bir personelin sicil amirinin yanında değerlendirmeye esas alınacak yeterli sürede çalışmamış olması durumunda sicil raporu kim tarafından doldurulur?",
          "options": [
            "Değerlendirmeye en yetkili önceki sicil amiri",
            "Genel Müdür",
            "İnsan Kaynakları Daire Başkanı",
            "Sicil raporu o yıl için düzenlenmez"
          ],
          "correctAnswerIndex": 0
        },
        {
          "id": 8,
          "questionText": "Yönetmeliğe göre 'sicil amiri' kimdir?",
          "options": [
            "Personelin en yakın mesai arkadaşı",
            "Belirlenmiş usul ve esaslara göre sicil raporlarını doldurmakla görevlendirilen en yakın üst",
            "İnsan kaynakları uzmanı",
            "Sendika temsilcisi"
          ],
          "correctAnswerIndex": 1
        },
        {
          "id": 9,
          "questionText": "Sicil raporlarının objektif ve adil bir şekilde doldurulmasından kim sorumludur?",
          "options": [
            "Sadece personel",
            "Sadece İnsan Kaynakları Dairesi",
            "Sicil amirleri",
            "Disiplin Kurulu"
          ],
          "correctAnswerIndex": 2
        },
        {
          "id": 10,
          "questionText": "İki yıl üst üste sicil notu 'yetersiz' olan bir sözleşmeli personelin durumu ne olur?",
          "options": [
            "Görev yeri değiştirilir",
            "Maaşı düşürülür",
            "Sözleşmesi yenilenmez",
            "Eğitime gönderilir"
          ],
          "correctAnswerIndex": 2
        }
      ],
      "summary": "Bu yönetmelik, TTK'da çalışan sözleşmeli personelin sicil amirlerini, sicil raporlarının şeklini, düzenlenmesini ve bu raporlara dayanılarak yapılacak işlemleri belirler.",
      "flashcards": [],
      "isFavorite": false
    }
  ],
  "appTitle": "TTK GÖREVDE YÜKSELME SINAVI"
};
