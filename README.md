# meme_club

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/js-n6fbz8)

<h2> Structure d'un message: </h2>
<table>
	<tr>
		<th>Event Type</th>
		<th>Field</th>
		<th>Description</th>
	</tr>
	<tr>
		<td rowspan="12">
			<code>"message"</code><br />
			A message was sent to a thread.
		</td>
		<td><code>attachments</code></td>
		<td>An array of attachments to the message. Attachments vary in type, see the attachments table below.</td>
	</tr>
  
  <!-- Perso -->
  <tr>
		<td><code>hasReaction(reaction)</code></td>
		<td>A reçu la réaction ? : (:string) => boolean </td>
	</tr>
  <tr>
		<td><code>reactionMap</code></td>
		<td>Nombre de réaction : Object, clé (reaction):string, value (amount):integer
	</tr>
  <tr>
		<td><code>reactionNb</code></td>
		<td>Nombre de réaction total : :integer</td>
	</tr>
  <!-- Originals -->
	<tr>
		<td><code>body</code></td>
		<td>The string corresponding to the message that was just received.</td>
	</tr>
	<tr>
		<td><code>isGroup</code></td>
		<td>boolean, true if this thread is a group thread (more than 2 participants).</td>
	</tr>
    <tr>
        <td><code>mentions</code></td>
        <td>An object containing people mentioned/tagged in the message in the format { id: name }</td>
    </tr>
	<tr>
		<td><code>messageID</code></td>
		<td>A string representing the message ID.</td>
	</tr>
	<tr>
		<td><code>senderID</code></td>
		<td>The id of the person who sent the message in the chat with threadID.</td>
	</tr>
	<tr>
		<td><code>threadID</code></td>
		<td>The threadID representing the thread in which the message was sent.</td>
	</tr>
  	<tr>
		<td><code>isUnread</code></td>
		<td>Boolean representing whether or not the message was read.</td>
	</tr>
	<tr>
		<td><code>type</code></td>
		<td>For this event type, this will always be the string <code>"message"</code>.</td>
	</tr>
  </table>
