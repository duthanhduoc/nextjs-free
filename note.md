# Một số vấn đề chưa giải quyết

- Video này không có trong dự định, để thực hiện video này mình phải chỉnh sửa lại hệ thống authentication backend, nhưng để đảm bảo tính tương thích ngược (để các bạn sau xem các video trước đó làm vẫn được) thì mình không thể thay đổi hết hệ thống authentication backend của mình được.

- Chúng ta dùng session token để lưu giữ phiên đăng nhập, session token của mình là 1 JWT có `exp` là thời gian hết hạn của nó. Nếu backend thay đổi thời gian hết hạn token thì JWT sẽ là một JWT mới, điều này không đúng theo concept session token. Vì nếu dùng session token chúng ta chỉ cần thay đổi thời gian hạn của token thôi, chứ không phải tạo ra một token mới.

- Vậy nên khi xem video này, các bạn có thể bỏ qua giá trị `exp` trong JWT, **coi như nó vô nghĩa**. Chúng ta sẽ dùng một giá trị khác để xác định thời gian hết hạn của token.

## Khi đang dùng mà session token hết hạn thì sao?

Thì phải cho user đăng xuất.

Nhưng nếu đang thực hiện chức năng quan trọng mà bắt user đăng xuất => không tốt về mặt UX

Cách tốt nhất để giải quyết là trong lúc người dùng đang dùng web thì chúng ta tăng thời gian hết hạn của session

Để làm được thì cần 2 yếu tố:

- Backend của bạn phải hỗ trợ chức năng Sliding Session, tức là tăng giá trị expire của session

- Frontend của bạn phải kiểm tra thời gian hết hạn của session token và tăng thời gian hết hạn của nó trước khi nó hết hạn. Vì session token hết hạn thì coi như vô dụng. Vậy nên cần refresh trước khi nó hết hạn

Ví dụ session token hết hạn sau 15 ngày thì mỗi khi thời hạn hết hạn còn dưới 7 ngày refresh lại một lần.

Trong trường hợp người ta không mở website 15 ngày thì khi mở lên sẽ bị đăng xuất

Cách làm này gần giống với phương pháp refresh token, chỉ khác là khi refresh token chúng ta nhận lại cặp access token và refresh token mới. Còn khi dùng session này thì token vẫn giữ nguyên, chỉ là thời gian hết hạn của nó được tăng lên

## Nếu tôi dùng access token và refresh token thì sao?

## Dùng axios thì sao?
