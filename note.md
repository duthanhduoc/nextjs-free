# Một số vấn đề chưa giải quyết

## Khi đang dùng mà session token hết hạn thì sao?

Thì phải cho user đăng xuất.

Các bạn cần phải hỏi backend rằng format trả về khi session token hết hạn là gì, session token không tồn tại là gì để thực hiện logic logout bên Next.js

Nhưng nếu đang thực hiện chức năng quan trọng mà bắt user đăng xuất => không tốt về mặt UX

Vậy thì chúng ta cần phải refresh lại session token

Nếu như dùng session token để làm authentication thì không thể để nó hết hạn mới refresh được, vì session token hết hạn thì coi như vô dụng. Vậy nên cần refresh trước khi nó hết hạn, ví dụ session token hết hạn sau 15 ngày thì mỗi khi thời hạn hết hạn còn dưới 7 ngày refresh lại một lần.

Việc làm này đòi hỏi API của bạn phải hỗ trợ chức năng refresh session token

Trong trường hợp người ta không mở website 15 ngày thì khi mở lên sẽ bị đăng xuất

## Nếu tôi dùng access token và refresh token thì sao?

## Dùng axios thì sao?
