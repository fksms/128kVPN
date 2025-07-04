import type { Metadata } from 'next';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
    title: '128kVPN | Privacy Policy',
};

export default function PrivacyPolicyPage() {
    const t = useTranslations();

    const locale = useLocale();

    const countryCode = {
        ja: 'jp',
        en: 'us',
    }[locale];

    return (
        <div>
            <div className='flex justify-center max-w-full min-w-xs'>
                <div className='w-5xl px-10 py-16 space-y-4'>
                    <h1 className='text-3xl font-bold'>プライバシーポリシー</h1>
                    <p>本プライバシーポリシーは、無料サービスとして作成した128kVPN（以下「本サービス」といいます）において、利用者の個人情報の取扱いについて定めるものです。</p>
                    <p className=' text-gray-500 italic'>最終更新日: 2025年7月1日</p>

                    <h2 className='text-2xl font-bold mt-8'>1. 運営者情報</h2>
                    <p>問い合わせは、shogo3681@gmail.comまでご連絡ください。</p>

                    <h2 className='text-2xl font-bold mt-8'>2. 取得する情報とその方法</h2>
                    <p>本サービスは、以下の情報を取得します。</p>
                    <ul className='list-disc pl-6 space-y-2'>
                        <li>
                            <strong>メールアドレスおよびパスワード：</strong>
                            Firebaseによるユーザー登録・ログインのために利用者が入力するメールアドレスおよびパスワードを取得します。パスワードはFirebaseによって安全に管理され、当方が直接取得・保持することはありません。
                        </li>
                        <li>
                            <strong>ユーザーID：</strong>
                            Firebaseが発行するユーザーID（UID）を、本サービス内のVPN接続管理の識別子として使用します。このID単体では個人を特定できる情報には該当しません。
                        </li>
                        <li>
                            <strong>VPN接続・切断ログ：</strong>
                            VPNサーバーへの接続・切断操作の記録を一定期間保持します。日時とFirebaseのユーザーIDのみを保持し、通信内容の記録・保存は行いません。
                        </li>
                        <li>
                            <strong>アクセス解析データ：</strong>
                            サービス改善のため、Google Analyticsによるアクセス解析を行います。クッキーを使用して匿名のトラフィックデータを収集します。
                        </li>
                    </ul>

                    <h2 className='text-2xl font-bold mt-8'>3. 利用目的</h2>
                    <ul className='list-disc pl-6'>
                        <li>本サービスの提供・運営のため</li>
                        <li>不正利用防止およびセキュリティ確保のため</li>
                        <li>利用状況の把握およびサービス改善のため</li>
                    </ul>

                    <h2 className='text-2xl font-bold mt-8'>4. 第三者提供について</h2>
                    <p>当方は、以下の場合を除き、利用者の個人情報を第三者に提供することはありません。</p>
                    <ul className='list-disc pl-6'>
                        <li>利用者の同意がある場合</li>
                        <li>法令に基づき開示が求められる場合</li>
                    </ul>
                    <p>なお、Firebase、Google Analyticsなどの外部サービスにおける個人情報の取扱いについては、それぞれのプライバシーポリシーをご確認ください。</p>
                    <p>
                        <Link href='https://firebase.google.com/support/privacy' target='_blank' rel='noopener noreferrer' className='text-blue-700 underline'>
                            Firebase のプライバシーとセキュリティ
                        </Link>
                        <br />
                        <Link href={`https://marketingplatform.google.com/about/analytics/terms/${countryCode}/`} target='_blank' rel='noopener noreferrer' className='text-blue-700 underline'>
                            Google アナリティクス利用規約
                        </Link>
                    </p>

                    <h2 className='text-2xl font-bold mt-8'>5. 情報の管理方法</h2>
                    <p>
                        メールアドレスおよびパスワードはFirebaseにより管理され、当方は保持・閲覧しません。
                        <br />
                        VPN接続・切断ログはSQLiteデータベースに適切なアクセス制限を設けて管理します。
                        <br />
                        VPN接続時のIPアドレスや通信先情報、閲覧履歴など、通信の内容・履歴は一切記録・保存しません。
                    </p>

                    <h2 className='text-2xl font-bold mt-8'>6. 利用者の権利</h2>
                    <p>利用者は、自己の個人情報について、開示・訂正・削除を求めることができます。ご希望の場合は、上記お問い合わせ先までご連絡ください。</p>

                    <h2 className='text-2xl font-bold mt-8'>7. 免責事項</h2>
                    <p>
                        本サービスを通じて行われる通信内容について、当方は一切関与せず、その内容の合法性・正確性・安全性について保証するものではありません。また、利用者が本サービスを利用して行った行為について、当方は一切の責任を負いません。
                    </p>

                    <h2 className='text-2xl font-bold mt-8'>8. プライバシーポリシーの変更</h2>
                    <p>本プライバシーポリシーの内容は、必要に応じて変更することがあります。変更した場合は、本サービス上での掲示後直ちに適用されます。</p>
                </div>
            </div>
        </div>
    );
}
