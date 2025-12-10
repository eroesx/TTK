
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
        }
      ],
      "summary": "1982 Anayasası, Türkiye'nin en üst hukuki normu olarak devletin temel yapısını, organlarını (Yasama, Yürütme, Yargı), temel hak ve hürriyetleri düzenler. Güçler ayrılığı ilkesini benimser. Değiştirilemez maddeleri arasında devletin şeklinin Cumhuriyet olduğu, bayrağı, milli marşı ve başkenti yer alır. Temel hak ve hürriyetler, ancak kanunla ve Anayasa'nın ruhuna uygun olarak sınırlanabilir.",
      "flashcards": [],
      "isFavorite": false
    },
    {
      "id": "ataturk-ilkeleri-ve-inkilap-tarihi-1",
      "name": "Atatürk İlkeleri ve İnkilap Tarihi",
      "iconName": "Science",
      "color": "bg-sky-500/20",
      "bgColor": "bg-sky-900/40",
      "questions": [
        {
          "id": 1,
          "questionText": "Aşağıdakilerden hangisi, Cumhuriyetçilik ilkesinin doğal sonucu olarak kabul edilmelidir?",
          "options": [
            "Devletin ekonomik yatırımları bizzat üstlenmesi.",
            "Hukuk kurallarının dine dayandırılması.",
            "Milli egemenliğin, seçimler yoluyla yönetime yansıması.",
            "Toplumsal sınıfların ortadan kaldırılması."
          ],
          "correctAnswerIndex": 2
        }
      ],
      "summary": "Atatürk İlkeleri, modern Türkiye'nin temelini oluşturan altı ana prensiptir: Cumhuriyetçilik (ulusal egemenlik), Milliyetçilik (Türk milletinin birliği), Halkçılık (eşitlik ve sosyal devlet), Devletçilik (ekonomik kalkınma), Laiklik (din ve devlet işlerinin ayrılması) ve İnkılapçılık (sürekli modernleşme). İnkılap Tarihi, bu ilkeler ışığında Osmanlı'nın son döneminden Cumhuriyet'in kuruluşuna ve modernleşme hamlelerine uzanan süreci inceler.",
      "flashcards": [],
      "isFavorite": false
    },
    {
      "id": "turkce-dil-bilgisi-2",
      "name": "Türkçe Dil Bilgisi",
      "iconName": "Code",
      "color": "bg-emerald-500/20",
      "bgColor": "bg-emerald-900/40",
      "questions": [
        {
          "id": 1,
          "questionText": "Aşağıdaki cümlelerin hangisinde bir yazım yanlışı vardır?",
          "options": [
            "Herşey yolunda gibiydi.",
            "Art arda gelen sorunlar canını sıktı.",
            "Yarınki toplantıya o da katılacakmış.",
            "Bu konuyu bir de benden dinleyin."
          ],
          "correctAnswerIndex": 0
        }
      ],
      "summary": "Türkçe Dil Bilgisi; dilin ses yapısını (fonetik), kelime yapısını (morfoloji), cümle yapısını (sentaks) ve anlam yapısını (semantik) inceler. Yazım (imla) kuralları ve noktalama işaretleri, dilin doğru ve etkili kullanımını sağlar. Sözcük türleri (isim, sıfat, fiil vb.), cümlenin ögeleri ve anlatım bozuklukları bu alanın temel konularıdır.",
      "flashcards": [],
      "isFavorite": false
    },
    {
      "id": "657-sayili-devlet-memurlari-kanunu-3",
      "name": "657 Sayılı Devlet Memurları Kanunu",
      "iconName": "Book",
      "color": "bg-rose-500/20",
      "bgColor": "bg-rose-900/40",
      "questions": [
        {
          "id": 1,
          "questionText": "<p>657 sayılı Devlet Memurları Kanunu'na göre, aşağıdakilerden hangisi memurların temel ilkelerinden biri değildir?</p>",
          "options": [
            "Sınıflandırma",
            "Kariyer",
            "Liyakat",
            "Disiplin"
          ],
          "correctAnswerIndex": 3,
          "note": "<p><u style=\"background-color: transparent; color: rgb(0, 0, 0);\">Temel İlkeler</u><span style=\"background-color: transparent; color: rgb(0, 0, 0);\"> (</span><span style=\"background-color: transparent; color: rgb(255, 0, 0);\">SIKALİ</span><span style=\"background-color: transparent; color: rgb(0, 0, 0);\">)</span></p><p><span style=\"color: rgb(230, 0, 0);\">Sınıflandırma</span> (Meslek. ve niteliklere ayırma)</p><p><span style=\"color: rgb(230, 0, 0);\">Kariyer</span> (En ileri dereceye ilerleme)</p><p><span style=\"color: rgb(230, 0, 0);\">Liyakat</span> (Eşit imkan uygulanması)</p>"
        }
      ],
      "summary": "657 sayılı Kanun, devlet memurlarının hizmet şartlarını, haklarını, ödevlerini, sorumluluklarını ve özlük işlerini düzenleyen temel kanundur. Liyakat ve kariyer ilkelerini esas alır. Memurlara tanınan haklar (izin, sendika vb.) ve uymaları gereken yükümlülükler (sadakat, tarafsızlık vb.) ile disiplin cezaları bu kanunda ayrıntılı olarak belirtilir.",
      "flashcards": [],
      "isFavorite": true
    },
    {
      "id": "399-sayili-kanun-hukmunde-kararname-4",
      "name": "399 Sayılı Kanun Hükmünde Kararname",
      "iconName": "Law",
      "color": "bg-indigo-500/20",
      "bgColor": "bg-indigo-900/40",
      "questions": [
        {
          "id": 26,
          "questionText": "399 Sayılı Kamu İktisadi Teşebbüsleri Personel Rejiminin Düzenlenmesi ve 233 Sayılı Kanun Hükmünde Kararname-nin Bazı Maddelerinin Yürürlükten Kaldırılmasına Dair KHK' ya göre teşebbüs ve bağlı ortaklıklarda hizmetler hangi personel türleri eliyle gördürülür?",
          "options": [
            "Sadece Sözleşmeli Personel",
            "Sadece İşçiler",
            "Sadece Memurlar",
            "Memurlar, Sözleşmeli Personel ve İşçiler"
          ],
          "correctAnswerIndex": 3
        }
      ],
      "summary": "399 sayılı KHK, Kamu İktisadi Teşebbüsleri'nde (KİT) çalışan sözleşmeli personelin statüsünü düzenler. Bu personel, (I) sayılı cetvele tabi kadro karşılığı sözleşmeliler ve (II) sayılı cetvele tabi pozisyon karşılığı sözleşmeliler olarak ikiye ayrılır. 657'den farklı olarak, istihdamları iş sözleşmelerine dayanır ve özlük hakları bu kararname ile belirlenir.",
      "flashcards": [],
      "isFavorite": true
    },
    {
      "id": "ttk-ana-statusu-ve-teskilat-yapisi-5",
      "name": "TTK Ana Statüsü ve Teşkilat Yapısı",
      "iconName": "Globe",
      "color": "bg-teal-500/20",
      "bgColor": "bg-teal-900/40",
      "questions": [
        {
          "id": 1,
          "questionText": "Türkiye Taşkömürü Kurumunun Ana Statüsünün hukuki statüsü ile ilgili olarak aşağıdakilerden hangisi yanlıştır?",
          "options": [
            "Tüzel kişiliğe sahip, faaliyetlerinde özerk ve sorumluluğu sermayesi ile sınırlı iktisadi devlet teşekkülüdür.",
            "Türkiye Taşkömürünün merkezi Ankarada'dır.",
            "Türkiye Taşkömürünün sermayesi 13.000.000.000 TL olup, tamamı Devlete aittir.",
            "Türkiye Taşkömürünün ilgili olduğu bakanlık, Enerji ve Tabii Kaynaklar Bakanlığıdır."
          ],
          "correctAnswerIndex": 1
        }
      ],
      "summary": "Türkiye Taşkömürü Kurumu (TTK) Ana Statüsü, kurumun bir Kamu İktisadi Teşebbüsü olarak hukuki yapısını, amaçlarını (özellikle taşkömürü üretimi), faaliyet alanlarını ve organlarını tanımlar. Teşkilat yapısı; Genel Müdürlük, Yönetim Kurulu gibi karar ve icra organları ile merkez ve taşra birimlerinin hiyerarşik yapısını ve görev dağılımını içerir.",
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
            "Her yılın Ocak ayı içinde",
            "Her yılın Aralık ayının sonuna kadar",
            "Her yılın Temmuz ayı içinde",
            "Sözleşme dönemi sonunda"
          ],
          "correctAnswerIndex": 0
        }
      ],
      "summary": "",
      "flashcards": [],
      "isFavorite": false
    }
  ],
  "appTitle": "TTK GÖREVDE YÜKSELME SINAVI"
};
