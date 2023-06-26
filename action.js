const Jira = require('./common/net/Jira')
module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const issueId = this.argv.issue || this.config.issue || null
    const allowRepeats = this.argv.allowRepeats || this.config.allowRepeats || false
    const { comment } = this.argv

		if (!allowRepeats) {
			// TODO Add paging
			console.log(`Searching for existing comment to ${issueId}: \n${comment}`)
			const response = await this.Jira.getComments(issueId)
			if (response.comments.some(comment => comment.body = comment)) {
				console.log(`Skipping comment to ${issueId}: \n${comment}`)
				return {}
			}
		}

    console.log(`Adding comment to ${issueId}: \n${comment}`)
    await this.Jira.addComment(issueId, { body: comment })

    return {}
  }
}
