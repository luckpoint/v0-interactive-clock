-- ChatGPT Mac アプリ自動化スクリプト（最終修正版）

-- ログ出力用のハンドラ
on logMessage(message)
	log message
end logMessage

-- ChatGPTアプリにフォーカスを移動する関数
on ensureChatGPTFocus()
	tell application "ChatGPT"
		activate
	end tell
	delay 1
	tell application "System Events"
		repeat 10 times
			if frontmost of application process "ChatGPT" then exit repeat
			delay 0.2
		end repeat
	end tell
end ensureChatGPTFocus

-- (2) 応答完了待機もウィンドウを動的参照に
on waitForChatGPTResponse()
	tell application "System Events"
		tell application process "ChatGPT"
			my logMessage("ChatGPTの応答を待機中...")
			set maxWaitTime to 180
			set waitedTime to 0
			repeat while waitedTime < maxWaitTime
				try
					set stopButtonExists to false
					set fWin to front window
					-- ボタンを動的に検索
					set stopButtons to every button of fWin whose description is "Stop generating"
					if (count of stopButtons) > 0 then set stopButtonExists to true
					
					if not stopButtonExists then
						my logMessage("ChatGPTの応答が完了しました")
						delay 0.5
						exit repeat
					end if
					
					delay 0.5
					set waitedTime to waitedTime + 0.5
				on error
					delay 0.5
					set waitedTime to waitedTime + 0.5
				end try
			end repeat
			if waitedTime ≥ maxWaitTime then
				my logMessage("タイムアウト: ChatGPTの応答待機が最大時間に達しました")
			end if
		end tell
	end tell
end waitForChatGPTResponse

-- 入力欄を階層を問わず探す
on findPromptField()
	tell application "System Events"
		tell application process "ChatGPT"
			set elems to entire contents of front window
			
			-- まず AXTextArea を優先
			repeat with e in elems
				if role of e is "AXTextArea" then return e
			end repeat
			
			-- 次に AXTextField を試す
			repeat with e in elems
				if role of e is "AXTextField" then return e
			end repeat
			
			error "テキスト入力エリアが見つかりません"
		end tell
	end tell
end findPromptField

-- (2) sendMessage を findPromptField() に置き換え
on sendMessage(messageText)
	my logMessage("=== sendMessage 関数開始 ===")
	my logMessage("送信メッセージ: " & messageText)
	my ensureChatGPTFocus()
	tell application "System Events"
		if not (exists application process "ChatGPT") then
			my logMessage("ChatGPTプロセスが見つかりません")
			display dialog "ChatGPTが起動していません"
			return false
		end if
		tell application process "ChatGPT"
			try
				-- 動的にテキスト入力欄を取得
				set textInputArea to my findPromptField()
				click textInputArea
				delay 0.5
				key code 0 using command down -- Cmd+A
				delay 0.2
				key code 51 -- Delete
				delay 0.2
				
				set originalClipboard to the clipboard
				set the clipboard to messageText
				delay 0.5
				key code 9 using command down -- Cmd+V
				delay 0.5
				set the clipboard to originalClipboard
				
				delay 0.5
				key code 36 -- Enter
				
				delay 1
				my waitForChatGPTResponse()
				my logMessage("=== sendMessage 関数正常終了 ===")
				return true
			on error errMsg
				my logMessage("=== sendMessage 関数エラー終了: " & errMsg)
				display dialog "メッセージ送信エラー: " & errMsg
				return false
			end try
		end tell
	end tell
end sendMessage

-- 新しいチャットを開始する関数
on startNewChat()
	my ensureChatGPTFocus()
	tell application "System Events"
		key code 45 using command down -- ⌘N
		delay 1
	end tell
	display notification "新しいチャットを開始しました" with title "AppleScript自動化"
end startNewChat

-- 外部ファイルからプロンプトリストを読み込む関数
on loadPromptsFromFile(filePath)
	try
		-- POSIXパスを使用してファイルを読み込み
		set fileContent to do shell script "cat " & quoted form of filePath
		
		-- 改行で分割してリストに変換
		set AppleScript's text item delimiters to {return, linefeed}
		set promptList to text items of fileContent
		set AppleScript's text item delimiters to ""
		
		-- 空行を除去
		set cleanedList to {}
		repeat with promptLine in promptList
			set trimmedLine to my trimString(promptLine as string)
			if trimmedLine is not "" then
				set end of cleanedList to trimmedLine
			end if
		end repeat
		
		my logMessage("ファイルから " & (count of cleanedList) & " 個のプロンプトを読み込みました")
		return cleanedList
		
	on error errMsg
		my logMessage("ファイル読み込みエラー: " & errMsg)
		display dialog "プロンプトファイルの読み込みに失敗しました。" & return & "エラー: " & errMsg
		return {}
	end try
end loadPromptsFromFile

-- 文字列の前後の空白を削除する関数
on trimString(str)
	repeat while str starts with " " or str starts with tab
		set str to text 2 thru -1 of str
	end repeat
	repeat while str ends with " " or str ends with tab
		set str to text 1 thru -2 of str
	end repeat
	return str
end trimString

-- 相対パスを絶対パスに変換する関数
on resolveFilePath(inputPath)
	try
		-- すでに絶対パスの場合はそのまま返す
		if inputPath starts with "/" then
			return inputPath
		end if
		
		-- ホームディレクトリの ~ を展開
		if inputPath starts with "~/" then
			set homePath to (path to home folder) as string
			set inputPath to homePath & (text 3 thru -1 of inputPath)
			return POSIX path of inputPath
		end if
		
		-- 相対パスの場合、現在のディレクトリと結合
		set currentDir to do shell script "pwd"
		if currentDir ends with "/" then
			return currentDir & inputPath
		else
			return currentDir & "/" & inputPath
		end if
		
	on error errMsg
		my logMessage("パス解決エラー: " & errMsg)
		return inputPath
	end try
end resolveFilePath

-- メイン実行部分（コマンドライン引数対応）
on run argv
	-- コマンドライン引数をチェック
	if (count of argv) = 0 then
		display dialog "使用方法: osascript script.scpt [プロンプトファイルのパス]" & return & "例: osascript chatgpt_automation.scpt ~/prompts.txt"
		return
	end if
	
	set inputFilePath to item 1 of argv
	set promptFilePath to my resolveFilePath(inputFilePath)
	my logMessage("入力パス: " & inputFilePath)
	my logMessage("解決されたパス: " & promptFilePath)
	
	-- ファイルの存在確認
	try
		set fileAlias to alias (promptFilePath as POSIX file)
	on error
		-- シェルコマンドでも確認
		try
			do shell script "test -f " & quoted form of promptFilePath
			my logMessage("ファイルは存在しますが、aliasとして認識できません")
		on error
			display dialog "指定されたファイルが見つかりません: " & promptFilePath & return & "現在のディレクトリ: " & (do shell script "pwd")
			return
		end try
	end try
	
	-- プロンプトリストを外部ファイルから読み込み
	set promptList to my loadPromptsFromFile(promptFilePath)
	
	if (count of promptList) = 0 then
		display dialog "有効なプロンプトが見つかりませんでした。"
		return
	end if
	
	tell application "ChatGPT"
		activate
		delay 2
	end tell
	
	set promptCount to count of promptList
	repeat with i from 1 to promptCount
		set currentPrompt to item i of promptList
		my logMessage("=== プロンプト " & (i as string) & "/" & (promptCount as string) & " を送信中 ===")
		my sendMessage(currentPrompt)
		if i < promptCount then
			my logMessage("次のプロンプトまで180秒待機...")
			delay 180
		end if
	end repeat
	
	my logMessage("=== すべてのプロンプトの送信が完了しました ===")
	display notification ((promptCount as string) & "個のプロンプトをすべて送信しました") with title "AppleScript自動化"
end run
