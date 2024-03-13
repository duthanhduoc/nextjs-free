# Quản lý Auth trong Next.js

Để xác thực một request thì backend thường sẽ xác thực qua 2 cách:

1. FE gửi token qua header của request như `Authorization: Bearer <token>` (token thường được lưu trong localStorage của trình duyệt)
2. FE gửi token qua cookie của request (sự thật là cookie cũng nằm trong header của request)

Cách dùng Cookie có ưu điểm là an toàn hơn 1 chút so với cách dùng localStorage, nhưng đòi hỏi setup giữa Backend và FrontEnd phức tạp hơn.

Next.js chúng ta có thể dùng 2 cách trên, nhưng nó phức tạp hơn so với React.Js Client Side Rendering (CSR) truyền thống vì Next.js có cả Server và Client

## Cách 1: Dùng localStorage

Cách này chỉ áp dụng cho server check authentication dựa vào header `Authorization` của request.

- Tại trang login, chúng ta gọi api `/api/login` để đăng nhập. Nếu đăng nhập thành công, server sẽ trả về token, chúng ta lưu token vào localStorage. Việc này chúng ta sẽ làm ở phía client hoàn toàn.

- Tại những trang không cần authenticated, chúng ta có thể gọi api ở cả server và client của next.js mà không cần phải làm gì thêm.

Vấn đề sẽ nằm ở những trang cần authenticated. Làm sao để Next.js biết được user đã authenticated hay chưa? Để giải quyết vấn đề này chúng ta cần thiết kế một middleware

### Middleware ở Next.js

Middleware ở Next.js thì có 2 loại:

1. Middleware hoạt động ở client next (giống như những gì chúng ta đã làm trước đây ở React.js truyền thống)
2. Middleware hoạt động ở server next

#### Middleware ở client next

Nếu dùng middleware client thì chỉ cần tạo 1 `use client` `AuthenticatedComponent` và wrap nó ở những trang cần authenticated.

```tsx
'use client'
export default function AuthenticatedComponent({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <div>Chưa đăng nhập</div>
  return children
}
```

Cách dùng middleware này là server next.js sẽ không biết được user đã authenticated hay chưa. Ví dụ bạn truy cập vào trang `/profile` (cần authenticated) thì đây là flow diễn ra

Bạn enter url `/profile`
=> Trình duyệt gửi request đến server Next.js (request này sẽ gửi kèm cookie nếu có)
=> Server Next.js sẽ render trang `/profile` vì không biết được user đã authenticated hay chưa và trả về trình duyệt
=> Trình duyệt nhận được trang `/profile` và chạy `use client` `AuthenticatedComponent`
=> `AuthenticatedComponent` sẽ kiểm tra xem có token trong localStorage không, nếu có thì render trang `/profile` ra, nếu không thì render ra `Chưa đăng nhập`

Kết quả vẫn đúng, người dùng vẫn thấy trang `/profile` nếu đã authenticated nhưng cách này có một số khuyết điểm

- Profile Component phải là một client nếu chúng ta cần fetch các api cần authenticated, vì chỉ có client mới có thể truy cập được vào localStorage

- Không đồng nhất giữa server và client, điều này không tốt.

Cách giải quyết là dùng middleware ở server next.js

#### Middleware ở server next

Next.js cung cấp 1 cách để chúng ta có thể dùng middleware ở server next.js, có thể xem [tại đây](https://nextjs.org/docs/app/building-your-application/routing/middleware)

Middleware này sẽ chạy ngay khi có request gửi đến server Next.js, trước khi trang được render ở server.

Nhưng chúng ta cần 1 thứ gì đó để Next.js biết được user đã authenticated hay chưa, và thứ đó là chỉ có thể là cookie từ trình duyệt gửi lên. Vì khi bạn enter url `/profile` thì chỉ có cookie là được gửi kèm theo request đến server Next.js.

Nãy giờ chưa setup cookie gì cả, bây giờ chúng ta sẽ setup logic cookie. Đó là khi chúng ta login thành công thì chúng ta sẽ set cookie là `isLogged=true` vào trình duyệt ở client luôn. Cookie này có thời hạn tương tự với token, và cookie `isLogged` có thể dùng JavaScript can thiệp được. Như vậy thì khi request đến server Next.js thì server sẽ biết được user đã authenticated hay chưa dựa vào cookie `isLogged`. Client next.js cũng sẽ biết được user đã authenticated hay chưa dựa vào cookie `isLogged` (hoặc giá trị lưu trong localStorage tùy thích, nhưng khuyến khích dùng `isLogged` từ cookie cho đồng bộ).

Và đây là middleware ở server next.js

```tsx
export const config = {
  matcher: ['/profile']
}
export function middleware(request: NextRequest) {
  const isLogged =
    (request.cookies.get('isLogged')?.value as string | undefined) === 'true'
  if (!isLogged) return new Response('Chưa đăng nhập', { status: 401 })
}
```

Ưu điểm cách này là đồng bộ được giữa server và client.

### Gọi api trong next.js

Xong phần middleware cho localStorage, giờ chúng ta sẽ tìm hiểu cách gọi api trong next.js

Gọi API thì cũng có 2 cách là gọi ở client và gọi ở server. Ở đây mình chỉ bàn về việc gọi các API cần authenticated, vì những API không cần authenticated thì gọi ở cả client và server đều được.

Nếu gọi API cần authenticated như GET `/api/profile` thì chúng ta chỉ cần gán token vào header `Authorization` là xong. Y hệt như gọi API ở React.js truyền thống.

Còn gọi API cần authenticated ở server next.js thì làm thế nào để gán được token vào header `Authorization`, vì ở server Next.js, bạn không thể truy cập vào được localStorage của trình duyệt.

Thực sự đây chính là khuyết điểm của việc dùng localStorage để Authentication với Next.js.

Dù sao thì các route cần authenticated cũng không cần SEO nên không cần gọi ở server để SEO làm gì cả. Bạn hoàn toàn có thể gọi api ở client, nếu bạn chấp nhận điều này thì không sao cả.

Nhưng với cá nhân mình là người cầu toàn thì không thích khuyết điểm này lắm, chưa kể là Next.js với tôn chỉ là ưu tiên mọi thứ ở server.

Để giải quyết điều này thì chúng ta không nên dùng LocalSoage mà nên dùng Cookie để lưu token nhé. Đi đến cách 2 nào.

## Cách 2: Dùng Cookie

Cách này áp dụng cho Server check token dựa vào cookie hay header `Authorization` đều được.

Tại trang login chúng ta gọi api là `/app/login` từ Server Action để đăng nhập. Chúng ta dùng Server Action để làm proxy, trong server action, khi login thành công, chúng ta sẽ set cookie `token` vào trình duyệt và trả về token cho client để client set vào Context API hoặc caching react tùy thích (phục vụ nếu cần gọi api ở client).
